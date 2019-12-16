import moxios from "moxios";
import { fetchPracticeDataByODSCode } from "../api";
import { response } from "../../../__mocks__/ODSPortal";

describe("fetchPracticeDataByODSCode", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("API returns object with practice details by ODS code", async () => {
    const parsedPracticeDetails = {
      ODSCode: "F81749",
      name: "Market Square Surgery",
      address: {
        lines: "Waltham Abbey Health Ctre, 13 Sewardstone Road",
        postCode: "EN9 1NP",
        town: "Waltham Abbey",
      },
    };

    moxios.wait(() => {
      let request = moxios.requests.mostRecent();
      request.respondWith({
        status: 200,
        response,
      });
    });

    const addresses = await fetchPracticeDataByODSCode("F81749");

    expect(addresses).toEqual(parsedPracticeDetails);
  });
});
