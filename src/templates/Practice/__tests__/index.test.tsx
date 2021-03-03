import React from "react";
import moxios from "moxios";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";

import Practice from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";
import slaMetricsContent from "../../../data/content/practiceMetrics.json";
import { useFeatureToggle } from "../../../library/hooks/useFeatureToggle";

jest.mock("../../../library/hooks/useFeatureToggle");

describe("Practice template", () => {
  beforeEach(() => {
    moxios.install();
    when(mocked(useFeatureToggle))
      .calledWith("F_PRACTICE_SLA_PERCENTAGE")
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
        within3DaysPercentage: 25,
        within8DaysPercentage: 60,
        beyond8DaysPercentage: 15,
        within3Days: 5,
        within8Days: 12,
        beyond8Days: 3,
      },
    },
  };

  const {
    metrics: { integrated: practiceIntegratedData },
  } = pipelinePracticeData;

  it("renders practice details correctly", async () => {
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

    const { getByText } = render(
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

  it("renders metrics correctly", async () => {
    const { getByText, getAllByText } = render(
      <Practice pageContext={pipelinePracticeData} />
    );

    await waitFor(() => {
      expect(
        getAllByText(slaMetricsContent.tableHeaders[0])[0]
      ).toBeInTheDocument();
      expect(
        getByText(practiceIntegratedData.transferCount)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[1])[0]
      ).toBeInTheDocument();
      expect(
        getByText(`${practiceIntegratedData.within3DaysPercentage}%`)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[2])[0]
      ).toBeInTheDocument();
      expect(
        getByText(`${practiceIntegratedData.within8DaysPercentage}%`)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[3])[0]
      ).toBeInTheDocument();
      expect(
        getByText(`${practiceIntegratedData.beyond8DaysPercentage}%`)
      ).toBeInTheDocument();
    });
  });

  it("renders placeholders when there is no transfers", async () => {
    const pipelinePracticeNoTransferData = {
      ...pipelinePracticeData,
      metrics: {
        integrated: {
          transferCount: 0,
          within3DaysPercentage: null,
          within8DaysPercentage: null,
          beyond8DaysPercentage: null,
          within3Days: 0,
          within8Days: 0,
          beyond8Days: 0,
        },
      },
    };

    const { getAllByText } = render(
      <Practice pageContext={pipelinePracticeNoTransferData} />
    );

    await waitFor(() => {
      const dashElements = getAllByText("n/a");
      expect(dashElements[0]).toBeInTheDocument();
      expect(dashElements.length).toBe(3);
    });
  });

  it("renders metrics correctly when F_PRACTICE_SLA_PERCENTAGE is toggled off", async () => {
    when(mocked(useFeatureToggle))
      .calledWith("F_PRACTICE_SLA_PERCENTAGE")
      .mockReturnValue(false);

    const { getByText, getAllByText } = render(
      <Practice pageContext={pipelinePracticeData} />
    );

    await waitFor(() => {
      expect(
        getAllByText(slaMetricsContent.tableHeadersDeprecated[0])[0]
      ).toBeInTheDocument();
      expect(
        getByText(practiceIntegratedData.transferCount)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeadersDeprecated[1])[0]
      ).toBeInTheDocument();
      expect(getByText(practiceIntegratedData.within3Days)).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeadersDeprecated[2])[0]
      ).toBeInTheDocument();
      expect(getByText(practiceIntegratedData.within8Days)).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeadersDeprecated[3])[0]
      ).toBeInTheDocument();
      expect(getByText(practiceIntegratedData.beyond8Days)).toBeInTheDocument();
    });
  });
});
