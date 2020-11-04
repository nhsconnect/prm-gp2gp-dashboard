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
        keys: [testKey],
        list: testDocuments,
      })
    );

    const search = result.current;

    const suggestions = search.search("app");
    expect(suggestions).toEqual([{ name: "apple", colour: "green" }]);
  });

  it("returns correct suggestions when searching substring", async () => {
    const { result } = renderHook(() =>
      useSearch({
        keys: [testKey],
        list: testDocuments,
      })
    );

    const search = result.current;

    const suggestions = search.search("ppl");
    expect(suggestions).toEqual([{ name: "apple", colour: "green" }]);
  });

  it("returns multiple suggestions when search matches multiple documents", async () => {
    const { result } = renderHook(() =>
      useSearch({
        keys: [testKey],
        list: testDocuments,
      })
    );

    const search = result.current;

    const suggestions = search.search("pea");
    expect(suggestions).toEqual([
      { name: "peach", colour: "pink" },
      { name: "pear", colour: "green" },
    ]);
  });

  it("returns matching suggestions from multiple keys", async () => {
    const { result } = renderHook(() =>
      useSearch({
        keys: [testKey, additionalSearchKey],
        list: testDocuments,
      })
    );

    const search = result.current;

    const suggestions = search.search("gr");
    expect(suggestions).toEqual([
      { name: "apple", colour: "green" },
      { name: "pear", colour: "green" },
      { name: "grape", colour: "purple" },
    ]);
  });

  it("returns matching suggestions from nested array", async () => {
    const testNestedDocuments = [
      {
        fruits: [{ name: "mango" }],
      },
      {
        fruits: [{ name: "banana" }],
      },
      {
        fruits: [{ name: "grape" }],
      },
    ];

    const { result } = renderHook(() =>
      useSearch({
        keys: ["fruits.name"],
        list: testNestedDocuments,
      })
    );

    const search = result.current;

    const suggestions = search.search("an");
    expect(suggestions).toEqual([
      {
        fruits: [{ name: "mango" }],
      },
      { fruits: [{ name: "banana" }] },
    ]);
  });
});
