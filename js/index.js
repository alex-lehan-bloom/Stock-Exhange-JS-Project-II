searchIfSymbolInURL();
function searchIfSymbolInURL() {
  let urlParams = new URLSearchParams(window.location.search);
  let symbol = urlParams.get("symbol");
  if (symbol !== null) {
    search(symbol, data => {
      getCompanyProfile(data, listOfCompanyProfiles => {
        displaySearchResults(listOfCompanyProfiles);
      });
    });
    let searchBar = document.getElementById("searchBar");
    searchBar.value = symbol;
  }
}

let searchBar = document.getElementById("searchBar");
searchBar.onkeyup = debounce(() => {
  let searchBar = document.getElementById("searchBar");
  let searchQuery = searchBar.value;
  if (searchQuery.length === 0) {
    let ul = document.getElementById("searchResults");
    ul.textContent = "";
    let url = window.location.href.split("?")[0];
    window.history.pushState({ path: url }, "", url);
  } else {
    search(searchQuery, data => {
      getCompanyProfile(data, listOfCompanyProfiles => {
        displaySearchResults(listOfCompanyProfiles);
      });
    });
  }
}, 400);

async function search(searchQuery, callback) {
  hideSearchAlert();
  showSpinner();
  let searchResults = document.getElementById("searchResults");
  searchResults.textContent = "";
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`
  );
  let data = await response.json();
  if (data.length === 0) {
    showSearchAlert();
    hideSpinner();
  } else {
    let listOfCompanySymbols = data.map(searchResponse => {
      return searchResponse.symbol;
    });
    callback(listOfCompanySymbols);
  }
  let urlParams = new URLSearchParams(window.location.search);
  urlParams.set("symbol", searchQuery);
  let url = window.location.href.split("?")[0] + "?" + urlParams;
  window.history.pushState({ path: url }, "", url);
}

function getCompanyProfile(listOfCompanySymbols, callback) {
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
    // console.log(data);
    console.log(data[0]);
    for (let i = 0; i < data.length; i++) {
      callback(data[i].companyProfiles);
    }
  });
}

function displaySearchResults(listOfCompanyProfiles) {
  listOfCompanyProfiles.map(profile => {
    if (Object.keys(profile).length !== 0) {
      let img = document.createElement("img");
      img.src = profile.profile.image;
      img.classList.add("company-image");
      let name = document.createElement("a");
      name.href = `./company.html?symbol=${profile.symbol}`;
      name.classList.add("company-name");
      name.textContent = profile.profile.companyName;
      let symbol = document.createElement("span");
      symbol.classList.add("company-symbol");
      symbol.textContent = `(${profile.symbol})`;
      let stockUpOrDown = document.createElement("span");
      if (profile.profile.changesPercentage !== null) {
        stockUpOrDown.textContent = profile.profile.changesPercentage;
        if (profile.profile.changesPercentage.includes("+") === true) {
          stockUpOrDown.classList.add("stock-up");
        } else {
          stockUpOrDown.classList.add("stock-down");
        }
      }
      let li = document.createElement("li");
      li.classList.add("list-group-item");
      li.append(img, name, symbol, stockUpOrDown);
      searchResults.append(li);
    }
  });
  hideSpinner();
}

function showSpinner() {
  let spinner = document.getElementById("spinner");
  spinner.classList.remove("hide-element");
  spinner.classList.add("display-element");
}

function hideSpinner() {
  let spinner = document.getElementById("spinner");
  spinner.classList.remove("display-element");
  spinner.classList.add("hide-element");
}

function showSearchAlert() {
  let alert = document.getElementById("searchAlert");
  alert.classList.remove("hide-element");
  alert.classList.add("display-element");
}

function hideSearchAlert() {
  let alert = document.getElementById("searchAlert");
  alert.classList.remove("display-element");
  alert.classList.add("hide-element");
}

function debounce(cb, interval, immediate) {
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
