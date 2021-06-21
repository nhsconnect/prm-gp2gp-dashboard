import { filterPracticesByOdsCodes } from "../index";

describe("filterPracticesByOdsCodes", () => {
  it("returns one matching practice given one practice in practice list", () => {
    const odsCodes = ["A12345"];
    const practices = [
      {
        odsCode: "A12345",
        name: "GP Practice",
        metrics: [],
      },
    ];

    const actual = filterPracticesByOdsCodes(odsCodes, practices);

    expect(actual).toEqual(practices);
  });

  it("returns one matching practice given two practices in practice list", () => {
    const odsCodes = ["A12345"];
    const practice1 = {
      odsCode: "A12345",
      name: "GP Practice",
      metrics: [],
    };
    const practice2 = {
      odsCode: "B12345",
      name: "GP Practice 2",
      metrics: [],
    };

    const practices = [practice1, practice2];

    const actual = filterPracticesByOdsCodes(odsCodes, practices);
    const expected = [practice1];

    expect(actual).toEqual(expected);
  });

  it("returns multiple matching practices given multiple practices in practice list", () => {
    const odsCodes = ["A12345", "B12345", "C12345"];
    const practice1 = {
      odsCode: "A12345",
      name: "GP Practice",
      metrics: [],
    };
    const practice2 = {
      odsCode: "B12345",
      name: "GP Practice 2",
      metrics: [],
    };
    const practice3 = {
      odsCode: "C12345",
      name: "GP Practice 3",
      metrics: [],
    };
    const practice4 = {
      odsCode: "D12345",
      name: "GP Practice 4",
      metrics: [],
    };

    const practices = [practice1, practice2, practice3, practice4];

    const actual = filterPracticesByOdsCodes(odsCodes, practices);
    const expected = [practice1, practice2, practice3];

    expect(actual).toEqual(expected);
  });
});
