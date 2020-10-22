import { useState, useEffect } from "react";
import * as JsSearch from "js-search";

export const useSearch = ({ uniqueSearchKey, searchKeys, sourceDocuments }) => {
  const [search, setSearch] = useState({});

  useEffect(() => {
    const newSearchFromJsSearch = new JsSearch.Search(uniqueSearchKey);
    newSearchFromJsSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();

    searchKeys.map(searchKey => newSearchFromJsSearch.addIndex(searchKey));
    newSearchFromJsSearch.addDocuments(sourceDocuments);

    setSearch(newSearchFromJsSearch);

    // eslint-disable-next-line
  }, []);

  return search;
};
