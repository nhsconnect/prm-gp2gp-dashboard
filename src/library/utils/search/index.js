import Fuse from "fuse.js";

export class Search {
  constructor(keys, list) {
    const options = { isCaseSensitive: false, threshold: 0.1, keys };
    this.fuse = new Fuse(list, options);
  }

  search(value, maxLimit) {
    const searchOptions = maxLimit ? { limit: maxLimit } : {};
    const result = this.fuse.search(value, searchOptions);
    return result.map(resultItem => resultItem.item);
  }
}
