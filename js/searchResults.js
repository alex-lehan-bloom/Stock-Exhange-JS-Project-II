class SearchResults {
  constructor(searchResults, spinner) {
    this.searchResults = searchResults;
    this.spinner = spinner;
    this.companiesToCompare = [];
    this.openCompanyComparisonPage = document.getElementById(
      "openCompanyComparisonPage"
    );
  }

  displaySearchResults(listOfCompanyProfiles, searchQuery) {
    this.searchQuery = searchQuery;
    listOfCompanyProfiles.map((profile) => {
      let { image, companyName, changesPercentage } = profile.profile;
      let img = document.createElement("img");
      img.src = image;
      img.classList.add("company-image");
      img.addEventListener("error", () => {
        img.removeAttribute("src");
      });
      let name = document.createElement("a");
      name.href = `./company.html?symbol=${profile.symbol}`;
      name.classList.add("company-name");
      name.target = "_blank";
      name.textContent = companyName;
      let highlightName = new Mark(name);
      highlightName.mark(searchQuery);
      let symbol = document.createElement("span");
      symbol.classList.add("company-symbol");
      symbol.textContent = `(${profile.symbol})`;
      let highlightSymbol = new Mark(symbol);
      highlightSymbol.mark(searchQuery);
      let stockUpOrDown = document.createElement("span");
      if (changesPercentage !== null) {
        stockUpOrDown.textContent = changesPercentage;
        if (changesPercentage.includes("+") === true) {
          stockUpOrDown.classList.add("stock-up");
        } else {
          stockUpOrDown.classList.add("stock-down");
        }
      }
      let compareButton = document.createElement("button");
      compareButton.classList.add("btn");
      compareButton.textContent = "Compare";
      let mainListContent = document.createElement("div");
      mainListContent.classList.add("main-list-content");
      mainListContent.append(img, name, symbol, stockUpOrDown);
      this.li = document.createElement("li");
      this.li.classList.add("list-group-item");
      this.li.append(mainListContent, compareButton);
      this.searchResults.append(this.li);
      this.addCompanyToCompare(profile, compareButton);
    });
    this.hideSpinner();
  }

  addCompanyToCompare(profile, compareButton) {
    this.li.append(compareButton);
    compareButton.addEventListener("click", () => {
      let companiesToCompare = document.getElementById("companiesToCompare");
      if (companiesToCompare.querySelectorAll(".btn").length < 3) {
        let compareCompanyName = document.createElement("span");
        compareCompanyName.textContent = profile.symbol;
        let cancelIcon = document.createElement("span");
        cancelIcon.classList.add("fa", "fa-close");
        let companyToCompare = document.createElement("button");
        companyToCompare.classList.add("btn");
        companyToCompare.append(compareCompanyName, cancelIcon);
        companiesToCompare.append(companyToCompare);
        this.companiesToCompare.push(profile.symbol);
        this.removeCompanyToCompare(profile, companyToCompare);
      }
      this.openCompanyComparisonPage.textContent = "";
      this.openCompanyComparisonPage.href = `./company.html?symbol=`;
      for (let i = 0; i < this.companiesToCompare.length; i++) {
        if (i === 0) {
          this.openCompanyComparisonPage.href += `${this.companiesToCompare[i]}`;
        } else {
          this.openCompanyComparisonPage.href += `,${this.companiesToCompare[i]}`;
        }
        if (this.companiesToCompare.length === 1) {
          this.openCompanyComparisonPage.textContent = `Compare ${this.companiesToCompare.length} company`;
        } else {
          this.openCompanyComparisonPage.textContent = `Compare ${this.companiesToCompare.length} companies`;
        }
      }
    });
  }

  removeCompanyToCompare(profile, companyToCompare) {
    companyToCompare.addEventListener("click", () => {
      companyToCompare.remove();
      this.openCompanyComparisonPage.textContent = "";
      this.openCompanyComparisonPage.href = `./company.html?symbol=`;
      for (let i = 0; i < this.companiesToCompare.length; i++) {
        if (profile.symbol === this.companiesToCompare[i]) {
          this.companiesToCompare.splice(i);
        }
        if (this.companiesToCompare.length === 0) {
          u;
          this.openCompanyComparisonPage.textContent = "Compare companies";
        } else if (this.companiesToCompare.length === 1) {
          this.openCompanyComparisonPage.textContent = `Compare ${this.companiesToCompare.length} company`;
        } else {
          this.openCompanyComparisonPage.textContent = `Compare ${this.companiesToCompare.length} companies`;
        }
        if (this.companiesToCompare.length === 0) {
          this.openCompanyComparisonPage.removeAttribute("href");
        } else if (this.companiesToCompare.length === 1) {
          this.openCompanyComparisonPage.href += `${this.companiesToCompare[i]}`;
        } else {
          this.openCompanyComparisonPage.href += `,${this.companiesToCompare[i]}`;
        }
      }
    });
  }

  hideSpinner() {
    this.spinner.classList.remove("display-element");
    this.spinner.classList.add("hide-element");
  }
}
