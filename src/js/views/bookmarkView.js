class BookmarkView {
  #parentElement = document.querySelector(".bookmarks");
  #data;
  #html;

  update(bookmarks) {
    this.#clear();
    if (!bookmarks || (bookmarks instanceof Array && bookmarks.length === 0)) {
      this.#renderNoBookmarks();
      return;
    }
    this.#data = bookmarks;
    this.#createHtml();
    this.#clear();
    this.#parentElement.insertAdjacentHTML("afterbegin", this.#html);
  }

  #createHtml() {
    this.#html = `<ul class="bookmarks__list">${this.#createHtmlElements().join(
      ""
    )} </ul>`;
  }

  #renderNoBookmarks() {
    this.#html = ` <div class="message">
                <p>No bookmarks yet.</p>
              </div>`;
    document
      .querySelector(".bookmarks")
      .insertAdjacentHTML("afterbegin", this.#html);
  }

  #createHtmlElements() {
    return this.#data.map(
      (elem) => `<li class="preview">
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
export default new BookmarkView();
