let searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
  let searchQuery = document.getElementById("searchBar").value;
  console.log(searchQuery);
  search(searchQuery);
});

async function search(searchQuery) {
  showSpinner();
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&limit=10&exchange=NASDAQ`
  );
  let data = await response.json();
  let ul = document.getElementById("searchResults");
  ul.innerHTML = "";
  for (i = 0; i < data.length; i++) {
    let companyName = document.createElement("a");
    companyName.href = `/company.html?symbol=${data[i].symbol}`;
    companyName.innerHTML = `${data[i].name}`;
    companyName.classList.add("link-margin");
    let companySymbol = document.createElement("a");
    companySymbol.href = `/company.html?symbol=${data[i].symbol}`;
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

let test = document.getElementById("test");
test.addEventListener("click", () => {
  let spinner = document.getElementById("spinner");
  spinner.classList.add("display-element");
});
