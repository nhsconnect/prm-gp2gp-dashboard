import moxios from "moxios";
import { fetchPracticeDataByODSCode } from "../api";
import { practiceDataBuilder } from "../../../__mocks__/ODSPortalBuilder";

describe("fetchPracticeDataByODSCode", () => {
  beforeAll(() => {
    moxios.install();
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it("returns practice ODS code", async () => {
    const ODSCode = "J54637";
    const response = practiceDataBuilder({ ODSCode });
    mockAPIResponse(response);
    const practiceData = await fetchPracticeDataByODSCode(ODSCode);
    expect(practiceData.ODSCode).toEqual(ODSCode);
  });

  it("returns practice name in title case", async () => {
    const response = practiceDataBuilder({ name: "MARKET SQUARE" });
    mockAPIResponse(response);
    const practiceData = await fetchPracticeDataByODSCode("F81749");
    expect(practiceData.name).toEqual("Market Square");
  });

  it("returns practice post code", async () => {
    const response = practiceDataBuilder({ postCode: "H65 B64" });
    mockAPIResponse(response);
    const practiceData = await fetchPracticeDataByODSCode("F81749");
    expect(practiceData.address.postCode).toEqual("H65 B64");
  });

  it("returns practice town", async () => {
    const response = practiceDataBuilder({ town: "BIRMINGHAM" });
    mockAPIResponse(response);
    const practiceData = await fetchPracticeDataByODSCode("F81749");
    expect(practiceData.address.town).toEqual("Birmingham");
  });

  it("returns practice single line address", async () => {
    const response = practiceDataBuilder({
      lines: { AddrLn1: "14 HONEYCOMB LANE" },
    });
    mockAPIResponse(response);
    const practiceData = await fetchPracticeDataByODSCode("F81749");
    expect(practiceData.address.lines.length).toEqual(1);
    expect(practiceData.address.lines[0]).toEqual("14 Honeycomb Lane");
  });
  it("returns practice multiple line address", async () => {
    const response = practiceDataBuilder({
      lines: { AddrLn1: "CLEAR WATER HOUSE", AddrLn2: "14 HONEYCOMB LANE" },
    });
    mockAPIResponse(response);
    const practiceData = await fetchPracticeDataByODSCode("F81749");
    expect(practiceData.address.lines.length).toEqual(2);
    expect(practiceData.address.lines[0]).toEqual("Clear Water House");
    expect(practiceData.address.lines[1]).toEqual("14 Honeycomb Lane");
  });
  it("returns practice multiple line address where second line is missing", async () => {
    const response = practiceDataBuilder({
      lines: {
        AddrLn1: "36 LOWER CLAPTON ROAD",
        AddrLn3: "CLAPTON",
      },
    });
    mockAPIResponse(response);
    const practiceData = await fetchPracticeDataByODSCode("F84003");
    expect(practiceData.address.lines.length).toEqual(2);
    expect(practiceData.address.lines[0]).toEqual("36 Lower Clapton Road");
    expect(practiceData.address.lines[1]).toEqual("Clapton");
  });
  it("returns practice multiple line address in the right order where lines are unordered", async () => {
    const response = practiceDataBuilder({
      lines: {
        AddrLn3: "CLAPTON",
        AddrLn1: "CLEAR WATER HOUSE",
        AddrLn2: "36 LOWER CLAPTON ROAD",
      },
    });
    mockAPIResponse(response);
    const practiceData = await fetchPracticeDataByODSCode("F84003");
    expect(practiceData.address.lines.length).toEqual(3);
    expect(practiceData.address.lines[0]).toEqual("Clear Water House");
    expect(practiceData.address.lines[1]).toEqual("36 Lower Clapton Road");
    expect(practiceData.address.lines[2]).toEqual("Clapton");
  });
});

const mockAPIResponse = response => {
  moxios.wait(() => {
    let request = moxios.requests.mostRecent();
    request.respondWith({
      status: 200,
      response,
    });
  });
};
