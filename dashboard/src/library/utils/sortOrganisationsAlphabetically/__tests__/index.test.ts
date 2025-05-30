import { sortOrganisationsAlphabetically } from "../index";

describe("sortOrganisationsAlphabetically", () => {
  it("returns an alphabetised object given a list with a single organisation ", () => {
    const orgList = [{ odsCode: "12A", name: "NEW ICB", practices: ["A123"] }];

    const actual = sortOrganisationsAlphabetically(orgList);

    const expected = new Map();
    expected.set("N", [{ odsCode: "12A", name: "NEW ICB" }]);

    expect(actual).toEqual(expected);
  });

  it("returns an alphabetised object given a list with a two organisations beginning with the same letter", () => {
    const orgList = [
      { odsCode: "14A", name: "NORTH ICB", practices: ["A123"] },
      { odsCode: "12A", name: "NEW ICB", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    const expected = new Map();
    expected.set("N", [
      { odsCode: "12A", name: "NEW ICB" },
      { odsCode: "14A", name: "NORTH ICB" },
    ]);

    expect(actual).toEqual(expected);
  });

  it("returns an alphabetised object given a list with a two organisations beginning with different letters", () => {
    const orgList = [
      { odsCode: "14A", name: "NORTH ICB", practices: ["A123"] },
      { odsCode: "12A", name: "EAST ICB", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    const expected = new Map();
    expected.set("E", [{ odsCode: "12A", name: "EAST ICB" }]);
    expected.set("N", [{ odsCode: "14A", name: "NORTH ICB" }]);

    expect(actual).toEqual(expected);
  });

  it("returns an alphabetised object given a list with an organisation beginning with NHS", () => {
    const orgList = [
      { odsCode: "12A", name: "NHS EAST ICB", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    const expected = new Map();
    expected.set("E", [{ odsCode: "12A", name: "NHS EAST ICB" }]);

    expect(actual).toEqual(expected);
  });

  it("returns an alphabetised object given a list with a combination of organisations", () => {
    const orgList = [
      { odsCode: "1A", name: "WING ICB", practices: ["A1156"] },
      { odsCode: "12A", name: "NHS EAST ICB", practices: ["A1256"] },
      { odsCode: "3A", name: "NHS WEST ICB", practices: ["A1278"] },
      { odsCode: "15A", name: "SOUTH ICB", practices: ["A1299"] },
      { odsCode: "18A", name: "NORTH ICB", practices: ["A1876"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    const expected = new Map();
    expected.set("E", [{ odsCode: "12A", name: "NHS EAST ICB" }]);
    expected.set("N", [{ odsCode: "18A", name: "NORTH ICB" }]);
    expected.set("S", [{ odsCode: "15A", name: "SOUTH ICB" }]);
    expected.set("W", [
      { odsCode: "3A", name: "NHS WEST ICB" },
      { odsCode: "1A", name: "WING ICB" },
    ]);

    expect(actual).toEqual(expected);
    expect([...actual.keys()]).toEqual(["E", "N", "S", "W"]);
  });
});
