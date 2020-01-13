import React from "react";
import moxios from "moxios";
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

    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(practiceDetails);
    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(
      <Practice pageContext={{ ODSCode: practiceDetails.ODSCode }} />
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
