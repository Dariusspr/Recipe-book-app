import "../css/style.css";
import * as Model from "./model";
import SearchView from "./views/searchView";
import searchResultsView from "./views/searchResultsView";

async function controlSearch() {
  const query = SearchView.getSearchQuery();
  if (!query) return;
  Model.state.query = query;
  await Model.searchRecipes(query);
  searchResultsView.render(Model.state.searchResults);
}

function init() {
  SearchView.addSearchListener(controlSearch);
}
init();
