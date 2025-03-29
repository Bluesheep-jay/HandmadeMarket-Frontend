import api from "./api.service";

class SearchingService {
  constructor() {
    this.path = "search-suggestions";
  }

  async search(searchTerm) {

    const res = (await api.get(`${this.path}?q=${searchTerm}`)).data;
    return res;
  }
}

export default new SearchingService();
