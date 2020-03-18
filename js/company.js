let urlParams = new URLSearchParams(window.location.search);
let symbol = urlParams.get("symbol");
getCompanyProfile(symbol, data => {
  setHeader(data);
  setWebsite(data);
  setStockPrice(data);
  setDescription(data);
});
getStockPriceHistory(symbol, data => {
  createGraph(data);
});

async function getCompanyProfile(symbol, callback) {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/company/profile/${symbol}`
  );
  let data = await response.json();
  callback(data);
}

function setHeader(data) {
  let logo = document.getElementById("companyLogo");
  logo.src = data.profile.image;
  console.log(data.profile);
  let name = document.getElementById("companyName");
  name.innerText = data.profile.companyName;
  let industry = document.getElementById("companyIndustry");
  industry.innerText = `(${data.profile.industry})`;
}

function setWebsite(data) {
  let website = document.getElementById("website");
  website.innerText = data.profile.website;
  website.href = data.profile.website;
  website.target = "_blank";
}

function setStockPrice(data) {
  let price = document.getElementById("stockPrice");
  price.innerText = `$${data.profile.price}`;
  let stockUpOrDown = document.getElementById("stockUpDown");
  stockUpOrDown.classList.remove("stock-up");
  stockUpOrDown.classList.remove("stock-down");
  stockUpOrDown.innerText = `${data.profile.changesPercentage}`;
  console.log(data.profile.changesPercentage.includes("+"));
  if (data.profile.changesPercentage.includes("+") === true) {
    stockUpOrDown.classList.add("stock-up");
  } else {
    stockUpOrDown.classList.add("stock-down");
  }
}

function setDescription(data) {
  let description = document.getElementById("description");
  description.innerText = data.profile.description;
}

async function getStockPriceHistory(symbol, callback) {
  let response = await fetch(
    `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line`
  );
  let data = await response.json();
  console.log(data);
  callback(data);
}

function createGraph(data) {
  let ctx = document.getElementById("stockHistory").getContext("2d");
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
  let startDateOfStock = data.historical[0].date.slice(0, 4);
  if (startDateOfStock > year.toString()) {
    year = parseInt(startDateOfStock);
  }
  console.log(data.historical[0].date.slice(0, 4));
  console.log("Year" + year);
  for (i = 0; i < data.historical.length; i++) {
    if (data.historical[i].date.slice(0, 4) === year.toString()) {
      chart.data.labels.push(year);
      chart.data.datasets[0].data.push(data.historical[i].close);
      year += 1;
    }
  }
  console.log(chart.data.labels);
  console.log(chart.data.datasets[0].data);
  chart.update();
}
