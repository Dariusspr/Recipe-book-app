import "../css/style.css";
import * as Model from "./model";
import SearchView from "./views/searchView";
import SearchResultsView from "./views/searchResultsView";
import RecipeView from "./views/recipeView";
import PaginationView from "./views/paginationView";
import BookmarkView from "./views/bookmarkView";

async function controlSearch() {
  try {
    const query = SearchView.getSearchQuery();
    if (!query) return;
    Model.state.query = query;

    RecipeView.renderLoadingAnimation();

    await Model.searchRecipes(Model.state.query);

    renderSearchPage();
  } catch (err) {
    RecipeView.renderMessage();
    console.error(err.message);
  }
}

async function controlRecipe() {
  const id = window.location.hash.slice(1);
  if (!id) return;

  SearchResultsView.render(Model.state.currentSearchResultsPage);

  selectAndRenderRecipe(id);
}

async function controlPagination(page) {
  try {
    RecipeView.renderLoadingAnimation();

    await Model.selectSearchResultsPage(page);

    renderSearchPage();
  } catch (err) {
    RecipeView.renderMessage();
    console.error(err.message);
  }
}

function controlBookmarks() {
  if (!Model.state.selectedRecipe.bookmarked) {
    Model.addBookmark();
  } else {
    Model.removeBookmark();
  }
  RecipeView.render(Model.state.selectedRecipe);
  BookmarkView.update(Model.state.bookmarks);
}

function getMaxPageCount() {
  return Math.ceil(
    Model.state.totalSearchResultsCount / Model.state.itemsPerPage
  );
}

function renderSearchPage() {
  SearchResultsView.render(Model.state.currentSearchResultsPage);
  PaginationView.render(Model.state.currentPage, getMaxPageCount());
  selectAndRenderRecipe();
}

function selectAndRenderRecipe(id) {
  Model.selectRecipe(id);
  RecipeView.render(Model.state.selectedRecipe);
}

function init() {
  SearchView.addSearchListener(controlSearch);
  RecipeView.addSelectListener(controlRecipe);
  RecipeView.addBookmarkListener(controlBookmarks);
  PaginationView.addPaginationListener(controlPagination);
  BookmarkView.update(Model.state.bookmarks);
}
init();
