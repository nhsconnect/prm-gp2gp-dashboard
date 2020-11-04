import Fuse from "fuse.js";

export const useSearch = ({ keys, list }) => {
  const options = { isCaseSensitive: false, threshold: 0.1, keys };

  const fuse = new Fuse(list, options);

  const search = arg => {
    return fuse.search(arg).map(resultItem => resultItem.item);
  };

  return { search };
};
