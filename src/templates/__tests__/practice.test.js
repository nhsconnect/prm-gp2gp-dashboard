import React from "react";
import moxios from "moxios";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { act } from "react-dom/test-utils";

import Practice from "../practice";
import { mockAPIResponse } from "../../../__mocks__/api";
import { practiceDataBuilder } from "../../../__mocks__/ODSPortalBuilder";

describe("Practice template", () => {
  it("renders practice details correctly", async () => {
    moxios.install();
    const ODSPracticeData = {
      odsCode: "B86030",
      town: "LEEDS",
      postCode: "LS6 2AF",
      lines: { AddrLn1: "1 SHIRE OAK STREET", AddrLn2: "HEADINGLEY" },
    };
    const expectedODSPracticeData = {
      odsCode: "B86030",
      town: "Leeds",
      postCode: "LS6 2AF",
      lines: { line1: "1 Shire Oak Street", line2: "Headingley" },
    };
    const pipelinePracticeData = {
      odsCode: "B86030",
      name: "BURTON CROFT SURGERY",
      year: 2019,
      month: 11,
      metrics: {
        within3Days: 5,
        within8Days: 12,
        beyond8Days: 3,
      },
    };
    const expectedPracticeName = "Burton Croft Surgery";

    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(
      <Practice pageContext={pipelinePracticeData} />
    );

    await act(async () => {
      await waitFor(() => {
        expect(getByText(expectedODSPracticeData.odsCode)).toBeInTheDocument();
        expect(getByText(expectedPracticeName)).toBeInTheDocument();
        expect(getByText(expectedODSPracticeData.town)).toBeInTheDocument();
        expect(getByText(expectedODSPracticeData.postCode)).toBeInTheDocument();
        expect(
          getByText(expectedODSPracticeData.lines.line1)
        ).toBeInTheDocument();
        expect(
          getByText(expectedODSPracticeData.lines.line2)
        ).toBeInTheDocument();
      });
    });
    moxios.uninstall();
  });
});
