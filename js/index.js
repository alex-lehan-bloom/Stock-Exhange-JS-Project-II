searchIfSymbolInURL();
function searchIfSymbolInURL() {
  let urlParams = new URLSearchParams(window.location.search);
  let symbol = urlParams.get("symbol");
  if (symbol !== null) {
    search(symbol, data => {
      displaySearchResults(data);
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
  } else {
    search(searchQuery, data => {
      displaySearchResults(data);
    });
  }
}, 400);

async function search(searchQuery, callback) {
  showSpinner();
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`
  );
  let data = await response.json();
  let urlParams = new URLSearchParams(window.location.search);
  urlParams.set("symbol", searchQuery);
  let url = window.location.href.split("?")[0] + "?" + urlParams;
  window.history.pushState({ path: url }, "", url);
  callback(data);
}

function displaySearchResults(data) {
  let ul = document.getElementById("searchResults");
  ul.textContent = "";
  hideSearchAlert();
  if (data.length === 0) {
    showSearchAlert();
  } else {
    for (i = 0; i < data.length; i++) {
      let companyName = document.createElement("a");
      companyName.target = "_blank";
      companyName.href = `./company.html?symbol=${data[i].symbol}`;
      companyName.textContent = `${data[i].name}`;
      companyName.classList.add("link-margin");
      let companySymbol = document.createElement("a");
      companySymbol.target = "_blank";
      companySymbol.href = `./company.html?symbol=${data[i].symbol}`;
      companySymbol.textContent = `${data[i].symbol}`;
      let li = document.createElement("li");
      li.classList.add("list-group-item");
      li.append(companyName, companySymbol);
      ul.append(li);
    }
  }
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

async function getCompanyProfile(symbol) {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${symbol}`
  );
  let data = await response.json();
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
