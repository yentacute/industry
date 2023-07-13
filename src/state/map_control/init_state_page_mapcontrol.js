import { reactive } from "vue";

const textSearch = reactive({
  search: "",
  isSearchPlus: false,
  result: [],
});

const methodsSearchHead = {
  handleChangeSeachPlus: function () {
    textSearch.isSearchPlus = !textSearch.isSearchPlus;
  },
  setResult: function (data) {
    textSearch.result = [...data];
  },
  setSearch: function (search) {
    textSearch.search = search;
  },
};

export { textSearch, methodsSearchHead };
