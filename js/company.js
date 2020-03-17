let urlParams = new URLSearchParams(window.location.search);
let symbol = urlParams.get("symbol");
getCompanyProfile(symbol, data => {
  setHeader(data);
  setStockPrice(data);
});

//Should move these all into separate functions
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

function setStockPrice(data) {
  console.log(data);
  let price = document.getElementById("stockPrice");
  price.innerText = `$${data.profile.price}`;
  let changes = document.getElementById("changes");
  changes.classList.remove("stock-up");
  changes.classList.remove("stock-down");
  changes.innerText = data.profile.changes;
  if (data.profile.changes < 1) {
    changes.classList.add("stock-down");
  } else {
    changes.classList.add("stock-up");
  }
  //   if ()
}
