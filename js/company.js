class Company {
  constructor(element, symbol) {
    this.content = element;
    this.symbol = symbol;
  }
  load() {
    this.getCompanyProfile(this.symbol, companyInfo => {
      this.createHeader(header => {
        this.setHeaderInfo(header, companyInfo);
      });
      this.createMainContentContainer(mainContentContainer => {
        this.setStockPrice(mainContentContainer, companyInfo);
        this.setDescription(mainContentContainer, companyInfo);
        this.getStockPriceHistory(this.symbol, stockHistory => {
          this.createGraph(mainContentContainer, stockHistory);
        });
      });
    });
  }

  async getCompanyProfile(symbol, callback) {
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/company/profile/${symbol}`
    );
    let companyInfo = await response.json();
    callback(companyInfo);
  }

  createHeader(callback) {
    let header = document.createElement("div");
    header.classList.add("header");
    callback(header);
  }

  setHeaderInfo(header, companyInfo) {
    let row = document.createElement("div");
    row.classList.add("row");
    let firstColumn = document.createElement("div");
    firstColumn.classList.add("col-3");
    let secondColumn = document.createElement("div");
    secondColumn.classList.add("col-6");
    let thirdColumn = document.createElement("div");
    thirdColumn.classList.add("col-3");
    let logo = document.createElement("img");
    logo.classList.add("company-logo");
    logo.src = companyInfo.profile.image;
    let name = document.createElement("h1");
    name.classList.add("company-name");
    name.textContent = companyInfo.profile.companyName;
    let industry = document.createElement("p");
    industry.textContent = `(${companyInfo.profile.industry})`;
    let website = document.createElement("a");
    website.classList.add("website+");
    website.textContent = companyInfo.profile.website;
    website.href = companyInfo.profile.website;
    website.target = "_blank";
    this.content.prepend(header);
    header.append(row);
    row.append(firstColumn, secondColumn, thirdColumn);
    firstColumn.append(logo);
    secondColumn.append(name);
    thirdColumn.append(industry);
    header.append(website);
  }

  createMainContentContainer(callback) {
    let mainContent = document.createElement("div");
    mainContent.classList.add("main-content");
    this.content.append(mainContent);
    callback(mainContent);
  }

  setStockPrice(mainContentContainer, companyInfo) {
    let companyStockContainer = document.createElement("div");
    companyStockContainer.classList.add("stock-info");
    let price = document.createElement("h3");
    price.classList.add("stock-price");
    price.textContent = `$${companyInfo.profile.price}`;
    let stockUpOrDown = document.createElement("span");
    stockUpOrDown.textContent = `${companyInfo.profile.changesPercentage}`;
    if (companyInfo.profile.changesPercentage.includes("+") === true) {
      stockUpOrDown.classList.add("stock-up");
    } else {
      stockUpOrDown.classList.add("stock-down");
    }
    companyStockContainer.append(price, stockUpOrDown);
    mainContentContainer.append(companyStockContainer);
  }

  setDescription(mainContentContainer, companyInfo) {
    let description = document.createElement("p");
    description.classList.add("description");
    description.textContent = companyInfo.profile.description;
    mainContentContainer.append(description);
  }

  async getStockPriceHistory(symbol, callback) {
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line`
    );
    let stockHistory = await response.json();
    callback(stockHistory);
  }

  createGraph(mainContentContainer, stockHistory) {
    let ctx = document.createElement("canvas");
    ctx.classList.add("chart");
    mainContentContainer.append(ctx);
    let chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Stock Price History",
            backgroundColor: "rgb(72, 179, 212)",
            borderColor: "rgb(72, 179, 212)",
            data: []
          }
        ]
      },
      options: {}
    });
    let year = 2005;
    let startDateOfStock = stockHistory.historical[0].date.slice(0, 4);
    if (startDateOfStock > year.toString()) {
      year = parseInt(startDateOfStock);
    }
    for (let i = 0; i < stockHistory.historical.length; i++) {
      if (stockHistory.historical[i].date.slice(0, 4) === year.toString()) {
        chart.data.labels.push(year);
        chart.data.datasets[0].data.push(stockHistory.historical[i].close);
        year += 1;
      }
    }
    chart.update();
  }
}
