import { getCookieExpiryDate } from "../index";

describe("getCookieExpiryDate", () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() =>
      new Date("2020-12-20T13:30:00.000Z").getTime()
    );
  });

  it("adds three months minus daylight savings to the date", () => {
    const expiryDate = getCookieExpiryDate();
    const expectedExpiryDate = new Date(2021, 2, 20, 12, 30);

    expect(expiryDate).toEqual(expectedExpiryDate);
  });
});
