import { sortOrganisationsAlphabetically } from "../index";

describe("sortOrganisationsAlphabetically", () => {
  it("returns an alphabetised object given a list with a single organisation ", () => {
    const orgList = [{ odsCode: "12A", name: "NEW CCG", practices: ["A123"] }];

    const actual = sortOrganisationsAlphabetically(orgList);
    const expected = { N: [{ odsCode: "12A", name: "NEW CCG" }] };

    expect(actual).toEqual(expected);
  });

  it("returns an alphabetised object given a list with a two organisations beginning with the same letter", () => {
    const orgList = [
      { odsCode: "14A", name: "NORTH CCG", practices: ["A123"] },
      { odsCode: "12A", name: "NEW CCG", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);
    const expected = {
      N: [
        { odsCode: "12A", name: "NEW CCG" },
        { odsCode: "14A", name: "NORTH CCG" },
      ],
    };

    expect(actual).toEqual(expected);
  });

  it("returns an alphabetised object given a list with a two organisations beginning with different letters", () => {
    const orgList = [
      { odsCode: "14A", name: "NORTH CCG", practices: ["A123"] },
      { odsCode: "12A", name: "EAST CCG", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);
    const expected = {
      E: [{ odsCode: "12A", name: "EAST CCG" }],
      N: [{ odsCode: "14A", name: "NORTH CCG" }],
    };

    expect(actual).toEqual(expected);
  });

  it("returns an alphabetised object given a list with an organisation beginning with NHS", () => {
    const orgList = [
      { odsCode: "12A", name: "NHS EAST CCG", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);
    const expected = { E: [{ odsCode: "12A", name: "NHS EAST CCG" }] };

    expect(actual).toEqual(expected);
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
    const expected = {
      E: [{ odsCode: "12A", name: "NHS EAST CCG" }],
      N: [{ odsCode: "18A", name: "NORTH CCG" }],
      S: [{ odsCode: "15A", name: "SOUTH CCG" }],
      W: [
        { odsCode: "3A", name: "NHS WEST CCG" },
        { odsCode: "1A", name: "WING CCG" },
      ],
    };

    expect(actual).toEqual(expected);
  });
});
