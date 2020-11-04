import Fuse from "fuse.js";

export class Search {
  constructor(keys, list) {
    const options = { isCaseSensitive: false, threshold: 0.1, keys };
    this.fuse = new Fuse(list, options);
  }

  search(value) {
    return this.fuse.search(value).map(resultItem => resultItem.item);
  }
}
