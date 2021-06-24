import sortOrganisationsAlphabetically from "../index";

describe("sortOrganisationsAlphabetically", () => {
  it("returns an alphabetised object given a list with a single organisation ", () => {
    const orgList = [{ odsCode: "12A", name: "New CCG", practices: ["A123"] }];

    const actual = sortOrganisationsAlphabetically(orgList);

    expect(actual.n).toEqual([{ odsCode: "12A", name: "New CCG" }]);
  });

  it("returns an alphabetised object given a list with a two organisations beginning with the same letter", () => {
    const orgList = [
      { odsCode: "14A", name: "North CCG", practices: ["A123"] },
      { odsCode: "12A", name: "New CCG", practices: ["A1256"] },
    ];

    const sortedOrgs = [
      { odsCode: "12A", name: "New CCG" },
      { odsCode: "14A", name: "North CCG" },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    expect(actual.n).toEqual(sortedOrgs);
  });

  it("returns an alphabetised object given a list with a two organisations beginning with different letters", () => {
    const orgList = [
      { odsCode: "14A", name: "North CCG", practices: ["A123"] },
      { odsCode: "12A", name: "East CCG", practices: ["A1256"] },
    ];

    const actual = sortOrganisationsAlphabetically(orgList);

    expect(actual.n).toEqual([{ odsCode: "14A", name: "North CCG" }]);
    expect(actual.e).toEqual([{ odsCode: "12A", name: "East CCG" }]);
  });
});
