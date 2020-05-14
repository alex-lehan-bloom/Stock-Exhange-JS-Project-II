let mainPageMarquee = new Marquee(document.getElementById("marquee"));
mainPageMarquee.load();

let searchForm = new SearchForm(
  document.getElementById("search"),
  document.getElementById("searchResults"),
  document.getElementById("spinner")
);
searchForm.createSearchBar();

let searchResults = new SearchResults(
  document.getElementById("searchResults"),
  document.getElementById("spinner")
);

searchForm.searchIfSymbolInURL((companies, searchQuery) => {
  searchResults.displaySearchResults(companies, searchQuery);
});
searchForm.onSearch((companies, searchQuery) => {
  searchResults.displaySearchResults(companies, searchQuery);
});
