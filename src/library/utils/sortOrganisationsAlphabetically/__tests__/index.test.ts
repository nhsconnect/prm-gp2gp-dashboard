import { sortOrganisationsAlphabetically } from "../index";

describe("sortOrganisationsAlphabetically", () => {
  it("returns an alphabetised object given a list with a single organisation ", () => {
    const orgList = [{ odsCode: "12A", name: "NEW CCG", practices: ["A123"] }];

    const actual = sortOrganisationsAlphabetically(orgList);

    expect(actual.N).toEqual([{ odsCode: "12A", name: "NEW CCG" }]);
  });

  it("returns an alphabetised object given a list with a two organisations beginning with the same letter", () => {
    const orgList = [
      { odsCode: "14A", name: "NORTH CCG", practices: ["A123"] },
      { odsCode: "12A", name: "NEW CCG", practices: ["A1256"] },
    ];

    const sortedOrgs = [
      { odsCode: "12A", name: "NEW CCG" },
      { odsCode: "14A", name: "NORTH CCG" },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    expect(actual.N).toEqual(sortedOrgs);
  });

  it("returns an alphabetised object given a list with a two organisations beginning with different letters", () => {
    const orgList = [
      { odsCode: "14A", name: "NORTH CCG", practices: ["A123"] },
      { odsCode: "12A", name: "EAST CCG", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    expect(actual.N).toEqual([{ odsCode: "14A", name: "NORTH CCG" }]);
    expect(actual.E).toEqual([{ odsCode: "12A", name: "EAST CCG" }]);
  });

  it("returns an alphabetised object given a list with an organisation beginning with NHS", () => {
    const orgList = [
      { odsCode: "12A", name: "NHS EAST CCG", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    expect(actual.N).toEqual([]);
    expect(actual.E).toEqual([{ odsCode: "12A", name: "NHS EAST CCG" }]);
  });

  it("returns an alphabetised object given a list with a combination of organisations", () => {
    const orgList = [
      { odsCode: "1A", name: "WING CCG", practices: ["A1156"] },
      { odsCode: "12A", name: "NHS EAST CCG", practices: ["A1256"] },
      { odsCode: "3A", name: "NHS WEST CCG", practices: ["A1278"] },
      { odsCode: "15A", name: "SOUTH CCG", practices: ["A1299"] },
      { odsCode: "18A", name: "NORTH CCG", practices: ["A1876"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    expect(actual).toEqual({
      A: [],
      B: [],
      C: [],
      D: [],
      E: [{ odsCode: "12A", name: "NHS EAST CCG" }],
      F: [],
      G: [],
      H: [],
      I: [],
      J: [],
      K: [],
      L: [],
      M: [],
      N: [{ odsCode: "18A", name: "NORTH CCG" }],
      O: [],
      P: [],
      Q: [],
      R: [],
      S: [{ odsCode: "15A", name: "SOUTH CCG" }],
      T: [],
      U: [],
      V: [],
      W: [
        { odsCode: "3A", name: "NHS WEST CCG" },
        { odsCode: "1A", name: "WING CCG" },
      ],
      X: [],
      Y: [],
      Z: [],
    });
  });
});
