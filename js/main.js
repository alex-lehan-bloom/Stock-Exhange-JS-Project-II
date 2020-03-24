let searchForm = new SearchForm(
  document.getElementById("search"),
  document.getElementById("searchResults"),
  document.getElementById("spinner")
);
searchForm.createSearchBar();
let results = new SearchResults(
  document.getElementById("searchResults"),
  document.getElementById("spinner")
);
searchForm.searchIfSymbolInURL(companies => {
  results.displaySearchResults(companies);
});
searchForm.onSearch(companies => {
  results.displaySearchResults(companies);
});
