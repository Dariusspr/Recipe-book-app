import "../css/style.css";
import * as Model from "./model";
import SearchView from "./views/searchView";
import SearchResultsView from "./views/searchResultsView";
import RecipeView from "./views/recipeView";

async function controlSearch() {
  const query = SearchView.getSearchQuery();
  if (!query) return;
  Model.state.query = query;
  await Model.searchRecipes(query);
  SearchResultsView.render(Model.state.searchResults);
}

async function controlRecipe() {
  const id = window.location.hash.slice(1);
  if (!id) return;

  SearchResultsView.render(Model.state.searchResults);
  console.log(id);
  Model.selectRecipe(id);

  RecipeView.render(Model.state.selectedRecipe);
}

function init() {
  SearchView.addSearchListener(controlSearch);
  RecipeView.addSelectListener(controlRecipe);
}
init();
