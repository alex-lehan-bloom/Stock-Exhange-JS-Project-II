let mainPageMarquee = new Marquee(document.getElementById("marquee"));
mainPageMarquee.createMarque();
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
searchForm.searchIfSymbolInURL((companies, userInput) => {
  results.displaySearchResults(companies, userInput);
});
searchForm.onSearch((companies, userInput) => {
  results.displaySearchResults(companies, userInput);
});
