class Marquee {
  constructor(element) {
    this.marquee = element;
    this.marqueeContainer = document.createElement("div");
    this.marqueeContainer.classList.add("marquee-container");
  }

  load() {
    this.getStockResults(stockResults => {
      this.createMarquee(stockResults);
    });
  }

  async getStockResults(callback) {
    this.marquee.append(this.marqueeContainer);
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/stock/real-time-price`
    );
    let data = await response.json();
    callback(data);
  }

  createMarquee(stockResults) {
    for (let i = 0; i < 100; i++) {
      let symbol = document.createElement("span");
      symbol.textContent = stockResults.stockList[i].symbol;
      let price = document.createElement("span");
      price.classList.add("stock-up");
      price.textContent = `$${stockResults.stockList[i].price}`;
      let divWithStockAndPrice = document.createElement("div");
      divWithStockAndPrice.classList.add("marquee-item");
      divWithStockAndPrice.append(symbol, price);
      this.marqueeContainer.append(divWithStockAndPrice);
    }
  }
}
