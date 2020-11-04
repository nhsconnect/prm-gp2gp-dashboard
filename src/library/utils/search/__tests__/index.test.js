import { Search } from "../index";

describe("Search", () => {
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
    const fruitSearch = new Search([testKey], testDocuments);

    const suggestions = fruitSearch.search("app");
    expect(suggestions).toEqual([{ name: "apple", colour: "green" }]);
  });

  it("returns correct suggestions when searching substring", async () => {
    const fruitSearch = new Search([testKey], testDocuments);

    const suggestions = fruitSearch.search("ppl");
    expect(suggestions).toEqual([{ name: "apple", colour: "green" }]);
  });

  it("returns multiple suggestions when search matches multiple documents", async () => {
    const fruitSearch = new Search([testKey], testDocuments);

    const suggestions = fruitSearch.search("pea");
    expect(suggestions).toEqual([
      { name: "peach", colour: "pink" },
      { name: "pear", colour: "green" },
    ]);
  });

  it("returns matching suggestions from multiple keys", async () => {
    const fruitSearch = new Search(
      [testKey, additionalSearchKey],
      testDocuments
    );

    const suggestions = fruitSearch.search("gr");
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

    const fruitSearch = new Search(["fruits.name"], testNestedDocuments);

    const suggestions = fruitSearch.search("an");
    expect(suggestions).toEqual([
      {
        fruits: [{ name: "mango" }],
      },
      { fruits: [{ name: "banana" }] },
    ]);
  });
});
