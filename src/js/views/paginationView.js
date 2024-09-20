import icons from "../../img/icons.svg";

class PaginationView {
  #parentElement = document.querySelector(".pagination");
  #html;

  addPrevious(page) {
    this.#html += `<button data-page='${page}' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#left-icon"></use>
            </svg>
            <span>Page ${page}</span>
          </button>`;
  }

  addNext(page) {
    this.#html += `<button data-page='${page}' class="btn--inline pagination__btn--next">
            <span>Page ${page}</span>
            <svg class="search__icon">
              <use href="${icons}#right-icon"></use>
            </svg>
          </button>`;
  }

  render(currentPage, totalPages) {
    this.#clear();
    if (currentPage > 1 && currentPage < totalPages) {
      this.addPrevious(currentPage - 1);
      this.addNext(currentPage + 1);
    } else if (currentPage > 1) {
      this.addPrevious(currentPage - 1);
    } else if (totalPages > 1) {
      this.addNext(currentPage + 1);
    }

    this.#parentElement.insertAdjacentHTML("afterbegin", this.#html);
  }

  #clear() {
    this.#html = "";
    this.#parentElement.innerHTML = "";
  }

  addPaginationListener(listener) {
    this.#parentElement.addEventListener("click", (e) => {
      const clicked = e.target.closest(".btn--inline");
      if (!clicked) return;
      const page = +clicked.dataset.page;
      listener(page);
    });
  }
}

export default new PaginationView();
