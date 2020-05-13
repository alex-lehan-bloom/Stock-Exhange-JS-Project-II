class SearchForm {
  constructor(searchContainer, searchResults, spinner) {
    this.searchContainer = searchContainer;
    this.searchResults = searchResults;
    this.spinner = spinner;
    this.spinner.classList.add("spinner-border");
    this.urlParams = new URLSearchParams(window.location.search);
  }

  createSearchBar() {
    this.searchBar = document.createElement("input");
    this.searchBar.classList.add("form-control");
    this.searchBar.placeholder = "search";
    this.searchContainer.append(this.searchBar);
    this.zeroResultsAlert = document.createElement("div");
    this.zeroResultsAlert.classList.add(
      "alert",
      "alert-danger",
      "hide-element"
    );
    this.zeroResultsAlert.textContent = "Your search returned 0 results";
    this.searchContainer.append(this.zeroResultsAlert);
  }

  onSearch(callback) {
    this.searchBar.onkeyup = this.debounce(() => {
      this.searchQuery = this.searchBar.value;
      if (this.searchQuery.length === 0) {
        this.clearPreviousSearchResults();
        this.deleteURLParameters();
      } else {
        this.search((searchResults) => {
          this.getCompanyProfiles(searchResults, (listOfCompanyProfiles) => {
            callback(listOfCompanyProfiles, this.searchBar.value);
          });
        });
      }
    }, 400);
  }

  async search(callback) {
    this.hideSearchAlert();
    this.showSpinner();
    this.clearPreviousSearchResults();
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/search?query=${this.searchQuery}&limit=10&exchange=NASDAQ`
    );
    let searchResults = await response.json();
    if (searchResults.length === 0) {
      this.showSearchAlert();
      this.hideSpinner();
    } else {
      let listOfCompanySymbols = searchResults.map((company) => {
        return company.symbol;
      });
      callback(listOfCompanySymbols);
    }
    this.addSearchQueryAsURLParameter();
  }

  getCompanyProfiles(listOfCompanySymbols, callback) {
    let arrayOfFetchRequests = [];
    let companiesForFetchRequest = [];
    let finalIndexPosition = 2;
    for (let i = 0; i < listOfCompanySymbols.length; i++) {
      if (i <= finalIndexPosition) {
        companiesForFetchRequest.push(listOfCompanySymbols[i]);
      } else {
        companiesForFetchRequest = [listOfCompanySymbols[i]];
        finalIndexPosition += 3;
      }
      if (
        companiesForFetchRequest.length === 3 ||
        i === listOfCompanySymbols.length - 1
      ) {
        arrayOfFetchRequests.push(
          `https://financialmodelingprep.com/api/v3/company/profile/${companiesForFetchRequest[0]},
          ${companiesForFetchRequest[1]},
          ${companiesForFetchRequest[2]}`
        );
      }
    }
    Promise.all(
      arrayOfFetchRequests.map((url) =>
        fetch(url).then((response) => response.json())
      )
    ).then((data) => {
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
    this.zeroResultsAlert.classList.remove("hide-element");
    this.zeroResultsAlert.classList.add("display-element");
  }

  hideSearchAlert() {
    this.zeroResultsAlert.classList.remove("display-element");
    this.zeroResultsAlert.classList.add("hide-element");
  }

  clearPreviousSearchResults() {
    this.searchResults.textContent = "";
  }

  addSearchQueryAsURLParameter() {
    this.urlParams.set("symbol", this.searchQuery);
    let url = window.location.href.split("?")[0] + "?" + this.urlParams;
    window.history.pushState({ path: url }, "", url);
  }

  deleteURLParameters() {
    let urlPath = window.location.href.split("?")[0];
    window.history.pushState({ path: urlPath }, "", urlPath);
  }

  debounce(cb, interval, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        timeout = null;
        if (!immediate) cb.apply(context, args);
      };
      let callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, interval);
      if (callNow) cb.apply(context, args);
    };
  }

  searchIfSymbolInURL(callback) {
    this.symbol = this.urlParams.get("symbol");
    if (this.symbol !== null) {
      this.search(this.symbol, (data) => {
        this.getCompanyProfiles(data, (listOfCompanyProfiles) => {
          callback(listOfCompanyProfiles, this.searchBar.value);
        });
      });
      this.searchBar.value = this.symbol;
    }
  }
}
