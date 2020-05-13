let mainPageMarquee = new Marquee(document.getElementById("marquee"));
mainPageMarquee.load();
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
searchForm.searchIfSymbolInURL((companies, searchQuery) => {
  results.displaySearchResults(companies, searchQuery);
});
searchForm.onSearch((companies, searchQuery) => {
  results.displaySearchResults(companies, searchQuery);
});
