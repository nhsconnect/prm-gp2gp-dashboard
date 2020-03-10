import { transformPracticeAddress } from "../ODSPortal";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";

describe("transformPracticeAddress", () => {
  it("returns practice post code", async () => {
    const postCode = "H65 B64";
    const ODSPortalResponse = practiceDataBuilder({ postCode });
    const practiceData = transformPracticeAddress(
      ODSPortalResponse.Organisation.GeoLoc.Location
    );

    expect(practiceData.postCode).toEqual(postCode);
  });

  it("returns practice town", async () => {
    const town = "BIRMINGHAM";
    const transforedTown = "Birmingham";
    const ODSPortalResponse = practiceDataBuilder({ town });
    const practiceData = transformPracticeAddress(
      ODSPortalResponse.Organisation.GeoLoc.Location
    );

    expect(practiceData.town).toEqual(transforedTown);
  });

  it("returns practice single line address", async () => {
    const line = "14 HONEYCOMB LANE";
    const lines = { AddrLn1: line };
    const transformedLine = "14 Honeycomb Lane";
    const ODSPortalResponse = practiceDataBuilder({ lines });
    const practiceData = transformPracticeAddress(
      ODSPortalResponse.Organisation.GeoLoc.Location
    );

    expect(practiceData.lines.length).toEqual(1);
    expect(practiceData.lines[0]).toEqual(transformedLine);
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
    const practiceData = transformPracticeAddress(
      ODSPortalResponse.Organisation.GeoLoc.Location
    );

    expect(practiceData.lines.length).toEqual(2);
    expect(practiceData.lines[0]).toEqual(transformedLine1);
    expect(practiceData.lines[1]).toEqual(transformedLine2);
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
    const practiceData = transformPracticeAddress(
      ODSPortalResponse.Organisation.GeoLoc.Location
    );

    expect(practiceData.lines.length).toEqual(2);
    expect(practiceData.lines[0]).toEqual(transformedLine1);
    expect(practiceData.lines[1]).toEqual(transformedLine3);
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
    const practiceData = transformPracticeAddress(
      ODSPortalResponse.Organisation.GeoLoc.Location
    );

    expect(practiceData.lines.length).toEqual(3);
    expect(practiceData.lines[0]).toEqual(transformedLine1);
    expect(practiceData.lines[1]).toEqual(transformedLine2);
    expect(practiceData.lines[2]).toEqual(transformedLine3);
  });
});
