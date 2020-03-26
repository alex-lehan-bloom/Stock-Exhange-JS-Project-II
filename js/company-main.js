let urlParams = new URLSearchParams(window.location.search);
let symbol = urlParams.get("symbol");
let companyInfo = new Company(document.getElementById("main"), symbol);
companyInfo.load();