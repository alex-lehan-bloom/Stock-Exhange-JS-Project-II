class SearchResults {
  constructor(searchResults, spinner) {
    this.searchResults = searchResults;
    this.spinner = spinner;
    this.companiesToCompare = [];
    this.openCompanyComparisonPage = document.getElementById(
      "openCompanyComparisonPage"
    );
  }

  displaySearchResults(listOfCompanyProfiles, userInput) {
    this.userInput = userInput;
    listOfCompanyProfiles.map(profile => {
      let img = document.createElement("img");
      img.src = profile.profile.image;
      img.classList.add("company-image");
      img.addEventListener("error", () => {
        img.removeAttribute("src");
      });
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
        let companiesToCompare = document.getElementById("companiesToCompare");
        if (companiesToCompare.querySelectorAll(".btn").length < 3) {
          let compareCompanyName = document.createElement("span");
          compareCompanyName.textContent = profile.symbol;
          let cancelIcon = document.createElement("span");
          cancelIcon.classList.add("fa", "fa-close");
          let companyToCompare = document.createElement("button");
          companyToCompare.classList.add("btn");
          companyToCompare.addEventListener("click", () => {
            this.openCompanyComparisonPage.textContent = "";
            companyToCompare.remove();
            for (let i = 0; i < this.companiesToCompare.length; i++) {
              if (profile.symbol === this.companiesToCompare[i]) {
                this.companiesToCompare.splice(i);
              }
              if (this.companiesToCompare.length === 1) {
                this.openCompanyComparisonPage.textContent = `Compare ${this.companiesToCompare.length} company`;
              } else {
                this.openCompanyComparisonPage.textContent = `Compare ${this.companiesToCompare.length} companies`;
              }
            }
            this.openCompanyComparisonPage.href = `./company.html?symbol=`;
            console.log("length");
            console.log(this.companiesToCompare.length);
            for (let i = 0; i < this.companiesToCompare.length; i++) {
              if (this.companiesToCompare.length === 1) {
                this.openCompanyComparisonPage.href += `${this.companiesToCompare[i]}`;
              } else {
                this.openCompanyComparisonPage.href += `,${this.companiesToCompare[i]}`;
              }
            }
          });
          companyToCompare.append(compareCompanyName, cancelIcon);
          companiesToCompare.append(companyToCompare);
          this.companiesToCompare.push(profile.symbol);
        }
        console.log(this.companiesToCompare);
        this.openCompanyComparisonPage.textContent = "";
        this.openCompanyComparisonPage.href = `./company.html?symbol=`;
        for (let i = 0; i < this.companiesToCompare.length; i++) {
          if (i === 0) {
            this.openCompanyComparisonPage.href += `${this.companiesToCompare[i]}`;
          } else {
            this.openCompanyComparisonPage.href += `,${this.companiesToCompare[i]}`;
          }
        }
        if (this.companiesToCompare.length === 1) {
          this.openCompanyComparisonPage.textContent = `Compare ${this.companiesToCompare.length} company`;
        } else {
          this.openCompanyComparisonPage.textContent = `Compare ${this.companiesToCompare.length} companies`;
        }
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

  hideSpinner() {
    this.spinner.classList.remove("display-element");
    this.spinner.classList.add("hide-element");
  }
}
