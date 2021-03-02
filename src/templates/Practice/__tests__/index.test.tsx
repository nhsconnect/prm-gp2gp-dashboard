import React from "react";
import moxios from "moxios";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import Practice from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";
import slaMetricsContent from "../../../data/content/practiceMetrics.json";

describe("Practice template", () => {
  beforeEach(() => {
    moxios.install();
  });
  afterAll(() => {
    moxios.uninstall();
  });

  const ODSPracticeData = {
    odsCode: "B86030",
    town: "LEEDS",
    postCode: "LS6 2AF",
    lines: {
      AddrLn1: "1 SHIRE OAK STREET",
      AddrLn2: "HEADINGLEY",
    },
  };

  const pipelinePracticeData = {
    odsCode: "B86030",
    name: "BURTON CROFT SURGERY",
    year: 2019,
    month: 11,
    metrics: {
      integrated: {
        transferCount: 20,
        within3Days: 5,
        within8Days: 12,
        beyond8Days: 3,
      },
    },
  };

  it("renders practice details and metrics correctly", async () => {
    const expectedODSPracticeData = {
      odsCode: "B86030",
      town: "Leeds",
      postCode: "LS6 2AF",
      lines: {
        line1: "1 Shire Oak Street",
        line2: "Headingley",
      },
    };
    const expectedPracticeName = "Burton Croft Surgery";

    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    const { getByText, getAllByText } = render(
      <Practice pageContext={pipelinePracticeData} />
    );

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

      expect(
        getAllByText(slaMetricsContent.tableHeaders[0])[0]
      ).toBeInTheDocument();
      expect(
        getByText(pipelinePracticeData.metrics.integrated.transferCount)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[1])[0]
      ).toBeInTheDocument();
      expect(
        getByText(pipelinePracticeData.metrics.integrated.within3Days)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[2])[0]
      ).toBeInTheDocument();
      expect(
        getByText(pipelinePracticeData.metrics.integrated.within8Days)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[3])[0]
      ).toBeInTheDocument();
      expect(
        getByText(pipelinePracticeData.metrics.integrated.beyond8Days)
      ).toBeInTheDocument();
    });
  });

  it("does not render practice address when API responds with an error", async () => {
    const expectedPracticeName = "Burton Croft Surgery";
    const statusCode = 500;
    mockAPIResponse(statusCode);

    const { getByText, queryByTestId } = render(
      <Practice pageContext={pipelinePracticeData} />
    );

    await waitFor(() => {
      expect(getByText(pipelinePracticeData.odsCode)).toBeInTheDocument();
      expect(getByText(expectedPracticeName)).toBeInTheDocument();
      expect(
        queryByTestId("organisation-details-address")
      ).not.toBeInTheDocument();
    });
  });
});
