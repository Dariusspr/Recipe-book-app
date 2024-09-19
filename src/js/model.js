import {
  API_URL,
  API_APP_ID,
  APP_APP_KEY,
  RECIPES_PER_PAGE,
} from "./constants";

export const state = {
  searchResults: [],
  currentPage: 1,
  totalSearchResultsCount: 0,
  itemsPerPage: RECIPES_PER_PAGE,
  query: "",
  currentSearchPageUrl: "",
  nextSearchPageUrl: "",
};

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response?.ok)
      throw new Error(`${response.message}: ${response.status}`);

    const json = await response.json();
    return json;
  } catch (err) {
    console.error(err);
    throw err;
  }
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
      id: getId(_links.self.href),
    };
    state.searchResults.push(result);
  });
}

function getId(link) {
  const start = link.lastIndexOf("/") + 1;
  const end =
    link.indexOf("?", start) === -1 ? link.length : link.indexOf("?", start);
  const id = link.substring(start, end);
  return id;
}

export async function searchRecipes(q) {
  try {
    resetState();
    let url = new URL(API_URL);
    url.search = new URLSearchParams({
      type: "public",
      q,
      app_id: API_APP_ID,
      app_key: APP_APP_KEY,
    });
    const data = await fetchJSON(url);
    if (!data || (data instanceof Array && data.length === 0)) {
      console.info("No search results");
      return;
    }

    updateState(url, data);
  } catch (err) {
    throw err;
  }
}

function resetState() {
  state.searchResults = [];
  state.currentPage = 1;
  state.totalSearchResultsCount = 0;
  state.currentSearchPageUrl = "";
  state.nextSearchPageUrl = "";
}
