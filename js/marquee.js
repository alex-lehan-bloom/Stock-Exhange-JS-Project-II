class Marquee {
  constructor(marquee) {
    this.marquee = marquee;
  }

  async createMarque() {
    let response = await fetch(
      `https://financialmodelingprep.com/api/v3/stock/real-time-price`
    );
    let data = await response.json();
    let stockInfoForMarquee = [];
    for (let i = 0; i < 100; i++) {
      stockInfoForMarquee.push(data.stockList[i].symbol);
      stockInfoForMarquee.push(`$${data.stockList[i].price.toString()}`);
    }
    // let marquee = document.getElementById("marquee");
    let symboleIndex = 0;
    let priceIndex = 1;
    for (let i = 0; i < stockInfoForMarquee.length / 2; i++) {
      let symbol = document.createElement("span");
      symbol.textContent = stockInfoForMarquee[symboleIndex];
      let price = document.createElement("span");
      price.classList.add("stock-up");
      price.textContent = stockInfoForMarquee[priceIndex];
      let divWithStockAndPrice = document.createElement("div");
      divWithStockAndPrice.append(symbol, price);
      marquee.append(divWithStockAndPrice);
      symboleIndex += 2;
      priceIndex += 2;
    }
  }
}

let mainPageMarquee = new Marquee(document.getElementById("marquee"));
mainPageMarquee.createMarque();
