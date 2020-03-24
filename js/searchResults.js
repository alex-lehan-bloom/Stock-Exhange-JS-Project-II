class SearchResults {
  constructor(searchResults, spinner) {
    this.searchResults = searchResults;
    this.spinner = spinner;
  }
  displaySearchResults(listOfCompanyProfiles) {
    listOfCompanyProfiles.map(profile => {
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
      this.searchResults.append(li);
    });
    this.hideSpinner();
  }

  hideSpinner() {
    this.spinner.classList.remove("display-element");
    this.spinner.classList.add("hide-element");
  }
}
