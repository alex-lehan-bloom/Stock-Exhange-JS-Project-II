class SearchForm {
  constructor(searchContainer, searchResults, spinner) {
    this.searchContainer = searchContainer;
    this.searchResults = searchResults;
    this.spinner = spinner;
    this.spinner.classList.add("spinner-border");
    this.searchBar = document.createElement("input");
    this.alert = document.createElement("div");
    this.urlParams = new URLSearchParams(window.location.search);
  }

  createSearchBar() {
    this.searchBar.classList.add("form-control");
    this.searchBar.placeholder = "search";
    this.searchContainer.append(this.searchBar);
    this.alert.classList.add("alert", "alert-danger", "hide-element");
    this.alert.textContent = "Your search returned 0 results";
    this.searchContainer.append(this.alert);
  }

  searchIfSymbolInURL(callback) {
    this.symbol = this.urlParams.get("symbol");
    if (this.symbol !== null) {
      this.search(this.symbol, data => {
        this.getCompanyProfile(data, listOfCompanyProfiles => {
          callback(listOfCompanyProfiles, this.searchBar.value);
        });
      });
      this.searchBar.value = this.symbol;
    }
  }

  onSearch(callback) {
    this.searchBar.onkeyup = this.debounce(() => {
      this.searchQuery = this.searchBar.value;
      if (this.searchQuery.length === 0) {
        this.searchResults.textContent = "";
        let url = window.location.href.split("?")[0];
        window.history.pushState({ path: url }, "", url);
      } else {
        this.search(this.searchQuery, data => {
          this.getCompanyProfile(data, listOfCompanyProfiles => {
            callback(listOfCompanyProfiles, this.searchBar.value);
          });
        });
      }
    }, 400);
  }

  async search(searchQuery, callback) {
    this.hideSearchAlert();
    this.showSpinner();
    this.searchResults.textContent = "";
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`
    );
    let data = await response.json();
    if (data.length === 0) {
      this.showSearchAlert();
      this.hideSpinner();
    } else {
      let listOfCompanySymbols = data.map(searchResponse => {
        return searchResponse.symbol;
      });
      callback(listOfCompanySymbols);
    }
    this.urlParams.set("symbol", searchQuery);
    let url = window.location.href.split("?")[0] + "?" + this.urlParams;
    window.history.pushState({ path: url }, "", url);
  }

  getCompanyProfile(listOfCompanySymbols, callback) {
    let arrayOfFetchRequests = [];
    let symbolsForFetchRequest = [];
    let finalIndexPosition = 2;
    for (let i = 0; i < listOfCompanySymbols.length; i++) {
      if (i <= finalIndexPosition) {
        symbolsForFetchRequest.push(listOfCompanySymbols[i]);
      } else {
        symbolsForFetchRequest = [listOfCompanySymbols[i]];
        finalIndexPosition += 3;
      }
      if (
        symbolsForFetchRequest.length === 3 ||
        i === listOfCompanySymbols.length - 1
      ) {
        arrayOfFetchRequests.push(
          `https://financialmodelingprep.com/api/v3/company/profile/${symbolsForFetchRequest[0]},
          ${symbolsForFetchRequest[1]},
          ${symbolsForFetchRequest[2]}`
        );
      }
    }
    Promise.all(
      arrayOfFetchRequests.map(url =>
        fetch(url).then(response => response.json())
      )
    ).then(data => {
      for (let i = 0; i < data.length; i++) {
        callback(data[i].companyProfiles);
      }
    });
  }

  showSpinner() {
    this.spinner.classList.remove("hide-element");
    this.spinner.classList.add("display-element");
  }

  hideSpinner() {
    this.spinner.classList.remove("display-element");
    this.spinner.classList.add("hide-element");
  }

  showSearchAlert() {
    this.alert.classList.remove("hide-element");
    this.alert.classList.add("display-element");
  }

  hideSearchAlert() {
    this.alert.classList.remove("display-element");
    this.alert.classList.add("hide-element");
  }

  debounce(cb, interval, immediate) {
    let timeout;
    return function() {
      let context = this,
        args = arguments;
      let later = function() {
        timeout = null;
        if (!immediate) cb.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, interval);

      if (callNow) cb.apply(context, args);
    };
  }
}
