import React from "react";
import moxios from "moxios";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import { waitForDomChange } from "@testing-library/dom";
import Practice from "../practice";
import { mockAPIResponse } from "../../../__mocks__/api";
import { practiceDataBuilder } from "../../../__mocks__/ODSPortalBuilder";

describe("Practice template", () => {
  it("renders practice details correctly", async () => {
    moxios.install();
    const practiceDetails = {
      ODSCode: "B86030",
      name: "BURTON CROFT SURGERY",
      town: "LEEDS",
      postCode: "LS6 2AF",
      lines: { AddrLn1: "1 SHIRE OAK STREET", AddrLn2: "HEADINGLEY" },
    };
    const transformedPracticeDetails = {
      ODSCode: "B86030",
      name: "Burton Croft Surgery",
      town: "Leeds",
      postCode: "LS6 2AF",
      lines: { line1: "1 Shire Oak Street", line2: "Headingley" },
    };
    const practiceData = {
      ODSCode: "B86030",
      year: 2019,
      month: 11,
      metrics: {
        "within3Days": 5,
        "within8Days": 12,
        "beyond8Days": 3
      }
    }

    const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery');
    useStaticQuery.mockImplementation(() => ({
      allFile: {
        edges: [{
          node: {
            childContentJson: {
              title: "Your practice integrating records",
              subtitle: "Number of days records were integrated within",
              within3Days: "< 3 DAYS",
              within8Days: "< 8 DAYS",
              beyond8Days: "> 8 DAYS"
            }
          }
        }]
      }
    }));

    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(practiceDetails);
    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(
      <Practice pageContext={practiceData} />
    );

    await waitForDomChange();

    expect(getByText(transformedPracticeDetails.ODSCode)).toBeInTheDocument();
    expect(getByText(transformedPracticeDetails.name)).toBeInTheDocument();
    expect(getByText(transformedPracticeDetails.town)).toBeInTheDocument();
    expect(getByText(transformedPracticeDetails.postCode)).toBeInTheDocument();
    expect(
      getByText(transformedPracticeDetails.lines.line1)
    ).toBeInTheDocument();
    expect(
      getByText(transformedPracticeDetails.lines.line2)
    ).toBeInTheDocument();

    moxios.uninstall();
  });
});
