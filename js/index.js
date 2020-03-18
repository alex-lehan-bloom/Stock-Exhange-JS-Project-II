searchIfSymbolInURL();
function searchIfSymbolInURL() {
  let urlParams = new URLSearchParams(window.location.search);
  let symbol = urlParams.get("symbol");
  if (symbol !== null) {
    search(symbol, data => {
      displaySearchResults(data, allProfiles => {
        test(allProfiles);
      });
    });
    let searchBar = document.getElementById("searchBar");
    searchBar.value = symbol;
  }
}

let searchBar = document.getElementById("searchBar");
searchBar.onkeyup = debounce(() => {
  let searchQuery = document.getElementById("searchBar").value;
  if (searchQuery.length === 0) {
    let ul = document.getElementById("searchResults");
    ul.innerHTML = "";
  } else {
    search(searchQuery, data => {
      displaySearchResults(data);
    });
  }
}, 400);

let searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
  let searchQuery = document.getElementById("searchBar").value;
  search(searchQuery, data => {
    displaySearchResults(data);
  });
});

async function search(searchQuery, callback) {
  showSpinner();
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`
  );
  let data = await response.json();
  let newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    "?symbol=" +
    searchQuery;
  window.history.pushState({ path: newurl }, "", newurl);
  callback(data);
}

function displaySearchResults(data, callback) {
  let ul = document.getElementById("searchResults");
  ul.innerHTML = "";
  let allProfiles = [];
  for (let i = 0; i < data.length; i++) {
  //   getCompanyProfile(data[i].symbol, companyProfile => {
  //     // console.log(companyProfile);
  //     // console.log("Profile");
  //     // console.log(companyProfile);
  //     allProfiles.push(companyProfile.profile);
  //     // console.log("SearchResults");
  //     // console.log(data);
  //     // let searchResults = data.map(info => {
  //     //   return `<li>${info.name} ${info.symbol}</li>`;
  //     // });
  //   });
  // }
  // console.log(searchResultsToDisplay);
  // let companyName = document.createElement("a");
  // companyName.target = "_blank";
  // companyName.href = `./company.html?symbol=${data[i].symbol}`;
  // companyName.innerHTML = `${data[i].name}`;
  // companyName.classList.add("link-margin");
  // let companySymbol = document.createElement("a");
  // companySymbol.target = "_blank";
  // companySymbol.href = `./company.html?symbol=${data[i].symbol}`;
  // companySymbol.innerHTML = `${data[i].symbol}`;
  // let li = document.createElement("li");
  // li.classList.add("list-group-item");
  // li.append(companyName, companySymbol);
  // ul.append(li);

  callback(allProfiles);
}

function test(allProfiles) {
  console.log("ALL PROFILES");
  console.log(allProfiles);
  console.log("After");
  let help = ["item 1"];
  // console.log(help);
  help = allProfiles.map(x => {
    console.log("inside");
    return x.beta;
  });
  console.log(help);
  hideSpinner();
}

async function getCompanyProfile(companySymbol, callback) {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${companySymbol}`
  );
  let data = await response.json();
  callback(data);
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
