import moxios from "moxios";
import {
  fetchPracticeDataByODSCode,
  transformPracticeData,
} from "../ODSPortal";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";

describe("fetchPracticeDataByODSCode", () => {
  it("returns a successful ODS portal response", async () => {
    moxios.install();
    const ODSCode = "B86030";
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder({ ODSCode });
    mockAPIResponse(statusCode, mockedResponse);

    const response = await fetchPracticeDataByODSCode(ODSCode);
    expect(response).toEqual(mockedResponse);
    moxios.uninstall();
  });
});

describe("transformPracticeData", () => {
  it("returns practice ODS code", () => {
    const ODSCode = "J54637";
    const ODSPortalResponse = practiceDataBuilder({ ODSCode });
    const practiceData = transformPracticeData(ODSPortalResponse);

    expect(practiceData.ODSCode).toEqual(ODSCode);
  });

  it("returns practice name in title case", async () => {
    const name = "MARKET SQUARE";
    const transformedName = "Market Square";
    const ODSPortalResponse = practiceDataBuilder({ name });
    const practiceData = transformPracticeData(ODSPortalResponse);

    expect(practiceData.name).toEqual(transformedName);
  });

  it("returns practice post code", async () => {
    const postCode = "H65 B64";
    const ODSPortalResponse = practiceDataBuilder({ postCode });
    const practiceData = transformPracticeData(ODSPortalResponse);

    expect(practiceData.address.postCode).toEqual(postCode);
  });

  it("returns practice town", async () => {
    const town = "BIRMINGHAM";
    const transforedTown = "Birmingham";
    const ODSPortalResponse = practiceDataBuilder({ town });
    const practiceData = transformPracticeData(ODSPortalResponse);

    expect(practiceData.address.town).toEqual(transforedTown);
  });

  it("returns practice single line address", async () => {
    const line = "14 HONEYCOMB LANE";
    const lines = { AddrLn1: line };
    const transformedLine = "14 Honeycomb Lane";
    const ODSPortalResponse = practiceDataBuilder({ lines });
    const practiceData = transformPracticeData(ODSPortalResponse);

    expect(practiceData.address.lines.length).toEqual(1);
    expect(practiceData.address.lines[0]).toEqual(transformedLine);
  });

  it("returns practice multiple line address", async () => {
    const line1 = "CLEAR WATER HOUSE";
    const line2 = "14 HONEYCOMB LANE";
    const lines = {
      AddrLn1: line1,
      AddrLn2: line2,
    };
    const transformedLine1 = "Clear Water House";
    const transformedLine2 = "14 Honeycomb Lane";
    const ODSPortalResponse = practiceDataBuilder({ lines });
    const practiceData = transformPracticeData(ODSPortalResponse);

    expect(practiceData.address.lines.length).toEqual(2);
    expect(practiceData.address.lines[0]).toEqual(transformedLine1);
    expect(practiceData.address.lines[1]).toEqual(transformedLine2);
  });

  it("returns practice multiple line address where second line is missing", async () => {
    const line1 = "36 LOWER CLAPTON ROAD";
    const line3 = "CLAPTON";
    const lines = {
      AddrLn1: line1,
      AddrLn3: line3,
    };
    const transformedLine1 = "36 Lower Clapton Road";
    const transformedLine3 = "Clapton";
    const ODSPortalResponse = practiceDataBuilder({ lines });
    const practiceData = transformPracticeData(ODSPortalResponse);

    expect(practiceData.address.lines.length).toEqual(2);
    expect(practiceData.address.lines[0]).toEqual(transformedLine1);
    expect(practiceData.address.lines[1]).toEqual(transformedLine3);
  });

  it("returns practice multiple line address in the right order where lines are unordered", async () => {
    const line1 = "CLEAR WATER HOUSE";
    const line2 = "36 LOWER CLAPTON ROAD";
    const line3 = "CLAPTON";
    const lines = {
      AddrLn3: line3,
      AddrLn1: line1,
      AddrLn2: line2,
    };
    const transformedLine1 = "Clear Water House";
    const transformedLine2 = "36 Lower Clapton Road";
    const transformedLine3 = "Clapton";

    const ODSPortalResponse = practiceDataBuilder({ lines });
    const practiceData = transformPracticeData(ODSPortalResponse);

    expect(practiceData.address.lines.length).toEqual(3);
    expect(practiceData.address.lines[0]).toEqual(transformedLine1);
    expect(practiceData.address.lines[1]).toEqual(transformedLine2);
    expect(practiceData.address.lines[2]).toEqual(transformedLine3);
  });
});

const mockAPIResponse = (status, response) => {
  moxios.wait(() => {
    let request = moxios.requests.mostRecent();
    request.respondWith({
      status,
      response,
    });
  });
};
