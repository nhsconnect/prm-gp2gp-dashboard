import * as JsSearch from "js-search";

export class Search {
  constructor(uniqueKey, indexNames, list) {
    this.jsSearch = new JsSearch.Search(uniqueKey);
    this.jsSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
    indexNames.forEach(indexName => {
      this.jsSearch.addIndex(indexName);
    });
    this.jsSearch.addDocuments(list);
  }

  search(value, maxLimit) {
    const result = this.jsSearch.search(value);
    return maxLimit ? result.slice(0, maxLimit) : result;
  }
}
