class SearchResultsView {
  #data;
  #parentElement = document.querySelector(".results");
  #html;
  render(data) {
    if (!data || (data instanceof Array && data.length === 0)) return;
    this.#data = data;
    this.#createHtml();
    this.#clear();
    this.#parentElement.insertAdjacentHTML("afterbegin", this.#html);
  }

  #createHtml() {
    this.#html = this.#createHtmlElements().join("");
  }

  #createHtmlElements() {
    return this.#data.map(
      (elem) =>
        `<li class="preview"></li>
              <a class="preview__link" href="#${elem.id}">
                <figure class="preview__fig">
                  <img
                    src="${elem.image}"
                    alt="${elem.label}"
                  />
                </figure>
                <div class="preview__data">
                  <h4 class="preview__title">${elem.label}</h4>
                  <p class="preview__category">${elem.type}</p>
                </div>
              </a>
            </li>`
    );
  }

  #clear() {
    this.#parentElement.innerHTML = "";
  }
}

export default new SearchResultsView();
