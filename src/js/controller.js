import "../css/style.css";
import * as Model from "./model";
import SearchView from "./views/searchView";

async function controlSearch() {
  const query = SearchView.getSearchQuery();
  if (!query) return;
  Model.state.query = query;
  await Model.searchRecipes(query);
}

function init() {
  SearchView.addSearchListener(controlSearch);
}
init();
