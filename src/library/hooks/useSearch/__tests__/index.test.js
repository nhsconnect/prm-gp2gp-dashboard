import { renderHook } from "@testing-library/react-hooks";
import { useSearch } from "../index";

describe("useSearch", () => {
  const testKey = "name";
  const additionalSearchKey = "colour";
  const testDocuments = [
    { name: "apple", colour: "green" },
    { name: "peach", colour: "pink" },
    { name: "pear", colour: "green" },
    { name: "banana", colour: "yellow" },
    { name: "grape", colour: "purple" },
  ];

  it("returns correct suggestions when searched", async () => {
    const { result } = renderHook(() =>
      useSearch({
        uniqueSearchKey: testKey,
        searchKeys: [testKey],
        sourceDocuments: testDocuments,
      })
    );

    const searchJs = result.current;

    const suggestions = searchJs.search("app");
    expect(suggestions).toEqual([{ name: "apple", colour: "green" }]);
  });

  it("returns correct suggestions when searching substring", async () => {
    const { result } = renderHook(() =>
      useSearch({
        uniqueSearchKey: testKey,
        searchKeys: [testKey],
        sourceDocuments: testDocuments,
      })
    );

    const searchJs = result.current;

    const suggestions = searchJs.search("ppl");
    expect(suggestions).toEqual([{ name: "apple", colour: "green" }]);
  });

  it("returns multiple suggestions when search matches multiple documents", async () => {
    const { result } = renderHook(() =>
      useSearch({
        uniqueSearchKey: testKey,
        searchKeys: [testKey],
        sourceDocuments: testDocuments,
      })
    );

    const searchJs = result.current;

    const suggestions = searchJs.search("pea");
    expect(suggestions).toEqual([
      { name: "peach", colour: "pink" },
      { name: "pear", colour: "green" },
    ]);
  });

  it("returns matching suggestions from multiple keys", async () => {
    const { result } = renderHook(() =>
      useSearch({
        uniqueSearchKey: testKey,
        searchKeys: [testKey, additionalSearchKey],
        sourceDocuments: testDocuments,
      })
    );

    const searchJs = result.current;

    const suggestions = searchJs.search("gr");
    expect(suggestions).toEqual([
      { name: "apple", colour: "green" },
      { name: "pear", colour: "green" },
      { name: "grape", colour: "purple" },
    ]);
  });
});
