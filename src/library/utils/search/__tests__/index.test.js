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

  it("returns correct suggestions when searched", () => {
    const fruitSearch = new Search([testKey], testDocuments);

    const suggestions = fruitSearch.search("app");
    expect(suggestions).toEqual([{ name: "apple", colour: "green" }]);
  });

  it("returns correct suggestions when searching substring", () => {
    const fruitSearch = new Search([testKey], testDocuments);

    const suggestions = fruitSearch.search("ppl");
    expect(suggestions).toEqual([{ name: "apple", colour: "green" }]);
  });

  it("returns multiple suggestions when search matches multiple documents", () => {
    const fruitSearch = new Search([testKey], testDocuments);

    const suggestions = fruitSearch.search("pea");
    expect(suggestions).toEqual([
      { name: "peach", colour: "pink" },
      { name: "pear", colour: "green" },
    ]);
  });

  it("returns matching suggestions from multiple keys", () => {
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

  it("returns matching suggestions from nested array", () => {
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

  it("returns subset of matching suggestions when the maxLimit is passed", () => {
    const fruitSearch = new Search([testKey], testDocuments);

    const suggestions = fruitSearch.search("a", 2);
    expect(suggestions).toEqual([
      { name: "apple", colour: "green" },
      { name: "banana", colour: "yellow" },
    ]);
  });
});
