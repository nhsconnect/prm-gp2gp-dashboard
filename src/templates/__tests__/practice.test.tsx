import React from "react";
import moxios from "moxios";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";

import Practice from "../practice";
import { mockAPIResponse } from "../../../__mocks__/api";
import { practiceDataBuilder } from "../../../__mocks__/ODSPortalBuilder";
import slaMetricsContent from "../../data/content/slaMetrics.json";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";

jest.mock("../../library/hooks/useFeatureToggle");

describe("Practice template", () => {
  beforeAll(() => {
    moxios.install();
    when(mocked(useFeatureToggle))
      .calledWith("F_PRACTICE_INTEGRATED_TRANSFER_COUNT")
      .mockReturnValue(true);
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

  it("renders practice details and metrics correctly without transferCount when F_PRACTICE_INTEGRATED_TRANSFER_COUNT is toggled off", async () => {
    when(mocked(useFeatureToggle))
      .calledWith("F_PRACTICE_INTEGRATED_TRANSFER_COUNT")
      .mockReturnValue(false);

    const pipelinePracticeDataOld = {
      odsCode: "B86030",
      name: "BURTON CROFT SURGERY",
      year: 2019,
      month: 11,
      metrics: {
        timeToIntegrateSla: {
          transferCount: 20,
          within3Days: 5,
          within8Days: 12,
          beyond8Days: 3,
        },
      },
    };

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

    const { getByText, queryByText } = render(
      <Practice pageContext={pipelinePracticeDataOld} />
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
        getByText(
          pipelinePracticeDataOld.metrics.timeToIntegrateSla.within3Days
        )
      ).toBeInTheDocument();
      expect(getByText(slaMetricsContent.within3Days)).toBeInTheDocument();
      expect(
        queryByText(
          pipelinePracticeDataOld.metrics.timeToIntegrateSla.transferCount
        )
      ).not.toBeInTheDocument();
      expect(
        queryByText(slaMetricsContent.tableHeaders[0])
      ).not.toBeInTheDocument();
    });
  });
});
