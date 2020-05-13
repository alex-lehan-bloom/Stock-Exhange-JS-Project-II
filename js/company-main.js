let urlParams = new URLSearchParams(window.location.search);
let symbols = urlParams.get("symbol");
let companyInfo = new Company(
  document.getElementById("companiesToCompare"),
  symbols
);
companyInfo.loadCompanyInfo();
