let searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
  let userInput = document.getElementById("searchBar").value;
  search(userInput, data => {
    displaySearchResults(data);
  });
});

async function search(userInput, callback) {
  showSpinner();
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${userInput}&limit=10&exchange=NASDAQ`
  );
  let data = await response.json();
  callback(data);
}

function displaySearchResults(data) {
  console.log("hello");
  let ul = document.getElementById("searchResults");
  ul.innerHTML = "";
  for (i = 0; i < data.length; i++) {
    let companyName = document.createElement("a");
    companyName.target = "_blank";
    companyName.href = `./company.html?symbol=${data[i].symbol}`;
    companyName.innerHTML = `${data[i].name}`;
    companyName.classList.add("link-margin");
    let companySymbol = document.createElement("a");
    companySymbol.target = "_blank";
    companySymbol.href = `./company.html?symbol=${data[i].symbol}`;
    companySymbol.innerHTML = `${data[i].symbol}`;
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    li.append(companyName, companySymbol);
    ul.append(li);
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
