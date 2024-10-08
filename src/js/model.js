import { RECIPES_PER_PAGE, FETCH_TIMEOUT_SEC } from "./constants";

export const state = {
  searchResults: [],
  currentSearchResultsPage: [],
  currentPage: 1,
  totalSearchResultsCount: 0,
  itemsPerPage: RECIPES_PER_PAGE,
  selectedRecipe: null,
  query: "",
  currentSearchPageUrl: "",
  nextSearchPageUrl: "",
  bookmarks: [],
};

async function fetchJSON(url) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_SEC * 1000),
    });
    if (!response?.ok)
      throw new Error(`${response.message}: ${response.status}`);

    const json = await response.json();
    return json;
  } catch (err) {
    throw err;
  }
}

export async function searchRecipes(q) {
  try {
    resetState();
    let url = new URL(process.env.API_URL);
    url.search = new URLSearchParams({
      type: "public",
      q,
      app_id: process.env.API_ID,
      app_key: process.env.API_KEY,
    });
    const data = await fetchJSON(url);
    if (!data || !data.count) {
      throw new Error("No search results found.");
    }

    updateState(url, data);
    loadCurrentSearchResultsPage();
  } catch (err) {
    throw err;
  }
}

async function fetchNextPage() {
  try {
    const url = state.nextSearchPageUrl;
    const data = await fetchJSON(url);
    updateState(url, data);
  } catch (err) {
    throw err;
  }
}

export function selectRecipe(id = null) {
  if (!id) {
    selectFirstRecipeOnPage();
  } else {
    state.selectedRecipe =
      state.searchResults.find((res) => res.id === id) ??
      state.bookmarks.find((res) => res.id === id);
  }
}

export async function selectSearchResultsPage(page) {
  try {
    const currentPageCount = Math.ceil(
      state.searchResults.length / state.itemsPerPage
    );
    if (page >= currentPageCount && page < state.totalSearchResultsCount) {
      await fetchNextPage();
    }
    loadCurrentSearchResultsPage(page);
  } catch (err) {
    throw err;
  }
}

function saveBookmarks() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export function addBookmark() {
  state.bookmarks.push(state.selectedRecipe);
  state.selectedRecipe.bookmarked = true;
  saveBookmarks();
}

export function removeBookmark() {
  state.bookmarks = state.bookmarks.filter(
    (e) => e.id !== state.selectedRecipe.id
  );
  state.selectedRecipe.bookmarked = false;
  saveBookmarks();
}

function updateState(url, data) {
  state.currentSearchPageUrl = url;
  state.nextSearchPageUrl = data._links.next?.href;
  state.totalSearchResultsCount = data.count;

  const recipes = data.hits;
  recipes.forEach(({ recipe, _links }) => {
    const result = {
      label: recipe.label,
      type: recipe.cuisineType[0],
      ingredients: recipe.ingredients,
      source: recipe.source,
      source_url: recipe.url,
      image: recipe.images.REGULAR.url,
      recipe_url: _links.self.href,
      id: extractIdFromLink(_links.self.href),
    };

    if (state.bookmarks.some((e) => e.id === result.id))
      result.bookmarked = true;

    state.searchResults.push(result);
  });
}

function extractIdFromLink(link) {
  const start = link.lastIndexOf("/") + 1;
  const end =
    link.indexOf("?", start) === -1 ? link.length : link.indexOf("?", start);
  const id = link.substring(start, end);
  return id;
}

function loadCurrentSearchResultsPage(page = 1) {
  state.currentPage = page;
  const start = (page - 1) * state.itemsPerPage;
  const end = start + state.itemsPerPage;
  state.currentSearchResultsPage = state.searchResults.slice(start, end);
}

function selectFirstRecipeOnPage() {
  if (state.searchResults.length == 0) return;
  const recipeIndex = state.itemsPerPage * (state.currentPage - 1);
  state.selectedRecipe = state.searchResults.at(recipeIndex);
  window.location.hash = state.selectedRecipe.id ?? "";
}

function resetState() {
  state.searchResults = [];
  state.currentSearchResultsPage = [];
  state.selectedRecipe = null;
  state.currentPage = 1;
  state.totalSearchResultsCount = 0;
  state.currentSearchPageUrl = "";
  state.nextSearchPageUrl = "";
}

function getBookmarks() {
  const data = localStorage.getItem("bookmarks");
  if (data) {
    state.bookmarks = JSON.parse(data);
  }
}

function init() {
  getBookmarks();
}
init();
