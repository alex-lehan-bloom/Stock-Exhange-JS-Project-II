class SearchResults {
  constructor(searchResults, spinner) {
    this.searchResults = searchResults;
    this.spinner = spinner;
  }

  displaySearchResults(listOfCompanyProfiles, userInput) {
    this.userInput = userInput;
    listOfCompanyProfiles.map(profile => {
      let img = document.createElement("img");
      img.src = profile.profile.image;
      img.classList.add("company-image");
      let name = document.createElement("a");
      name.href = `./company.html?symbol=${profile.symbol}`;
      name.classList.add("company-name");
      name.target = "_blank";
      name.textContent = profile.profile.companyName;
      let highlightName = new Mark(name);
      highlightName.mark(userInput);
      let symbol = document.createElement("span");
      symbol.classList.add("company-symbol");
      symbol.textContent = `(${profile.symbol})`;
      let highlightSymbol = new Mark(symbol);
      highlightSymbol.mark(userInput);
      let stockUpOrDown = document.createElement("span");
      if (profile.profile.changesPercentage !== null) {
        stockUpOrDown.textContent = profile.profile.changesPercentage;
        if (profile.profile.changesPercentage.includes("+") === true) {
          stockUpOrDown.classList.add("stock-up");
        } else {
          stockUpOrDown.classList.add("stock-down");
        }
      }
      let compareButton = document.createElement("button");
      compareButton.classList.add("btn");
      compareButton.textContent = "Compare";
      compareButton.addEventListener("click", () => {
        console.log(profile);
      });
      let mainListContent = document.createElement("div");
      mainListContent.classList.add("main-list-content");
      mainListContent.append(img, name, symbol, stockUpOrDown);
      let li = document.createElement("li");
      li.classList.add("list-group-item");
      li.append(mainListContent, compareButton);
      this.searchResults.append(li);
    });
    this.hideSpinner();
  }

  compare() {
    compareButton.addEventListener("click", () => {});
  }

  hideSpinner() {
    this.spinner.classList.remove("display-element");
    this.spinner.classList.add("hide-element");
  }
}
