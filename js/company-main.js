let urlParams = new URLSearchParams(window.location.search);
let symbol = urlParams.get("symbol");
console.log(symbol);
let companyInfo = new Company(
  document.getElementById("companiesToCompare"),
  symbol
);
companyInfo.load();
