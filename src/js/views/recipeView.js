import icons from "../../img/icons.svg";
class RecipeView {
  #parentElement = document.querySelector(".recipe");
  #html;
  render(recipe) {
    if (!recipe) return;
    console.log(recipe);
    this.#clear();
    this.#addFigure(recipe.bookmarked, recipe.image, recipe.label);
    this.#addDetails(recipe);

    this.#parentElement.insertAdjacentHTML("afterbegin", this.#html);
  }

  #addFigure(bookmarked, img, label) {
    this.#html = `<figure class="recipe__fig">
            <img
              src="${img}"
              alt="Test"
              class="recipe__img"
            />
        <button class="bookmark btn--round ${
          bookmarked ? "bookmark--active" : ""
        }">
            <svg>
              <use href="${icons}#bookmark-icon"></use>
            </svg>
          </button>
            <h1 class="recipe__title">
              <span>${label}</span>
            </h1>
          </figure>`;
  }

  #addDetails(recipe) {
    this.#html += `
          <div class="recipe__details">
            <div class="recipe__ingredients">
              <h2 class="heading--2">Recipe ingredients</h2>
              <ul class="recipe__ingredient-list">
                ${this.#addIngredients(recipe.ingredients).join("")}
              </ul>
            </div>

            <div class="recipe__directions">
              <h2 class="heading--2">How to cook it</h2>
  <p class="recipe__directions-text">
            This recipe was published by
            <a href="${
              recipe.source_url
            }"class="recipe__publisher" target="_blank">${recipe.source}</a>
    For full details, visit their website.         
 </p>
            </div>
          </div>
    `;
  }

  #addIngredients(ingredients) {
    return ingredients.map(
      (ingredient) => `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                    <use href="${icons}#list-marker-icon"></use>
                  </svg>
                <div class="recipe__quantity">${
                  !ingredient.quantity ? "" : ingredient.quantity
                }</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${
                    !ingredient.measure ? "" : ingredient.measure
                  }</span>
                  ${ingredient.food}
                </div>
            </li>`
    );
  }
  #clear() {
    this.#parentElement.innerHTML = "";
  }

  renderLoadingAnimation() {
    this.#clear();
    this.#html = `<div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`;
    this.#parentElement.insertAdjacentHTML("afterbegin", this.#html);
  }

  renderMessage(msg = "No search results found.") {
    this.#clear();
    this.#html = `<div class="message">
            <p>${msg}</p>
          </div>`;
    this.#parentElement.insertAdjacentHTML("afterbegin", this.#html);
  }

  addSelectListener(listener) {
    window.addEventListener("hashchange", (e) => {
      e.preventDefault();
      listener();
    });
  }

  addBookmarkListener(listener) {
    this.#parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".bookmark");
      if (!btn) return;
      listener();
    });
  }
}

export default new RecipeView();
