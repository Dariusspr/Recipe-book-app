class SearchView {
  #parentElement = document.querySelector(".search");

  getSearchQuery() {
    const query = this.#parentElement.querySelector(".search__field").value;
    console.log(query);
    this.#clear();
    return query;
  }

  #clear() {
    this.#parentElement.querySelector(".search__field").value = "";
  }

  addSearchListener(listener) {
    const btn = this.#parentElement.querySelector(".search__btn");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      listener();
    });
  }
}

export default new SearchView();
