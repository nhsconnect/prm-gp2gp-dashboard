import React from "react";
import moxios from "moxios";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import PracticeDownloadData from "../index";
import { mockAPIResponse } from "../../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../../__mocks__/ODSPortalBuilder";
import { practiceWithThreeMonthsMetrics } from "../../../../../__mocks__/practiceMetricsTestData";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";
import { useFeatureToggles } from "../../../../library/hooks/useFeatureToggle";

jest.mock("no-scroll");
jest.mock("../../../../library/hooks/useFeatureToggle");

const ODSPracticeData = {
  odsCode: "B86030",
  town: "LEEDS",
  postCode: "LS6 2AF",
  lines: {
    AddrLn1: "1 SHIRE OAK STREET",
    AddrLn2: "HEADINGLEY",
  },
};

const practicePageContext = {
  practice: practiceWithThreeMonthsMetrics,
  ccgOdsCode: "1234",
  ccgName: "ccg name",
  layout: "navigation-contents",
};

describe("PracticeDownloadData template - showContentsNavigation feature toggle is on", () => {
  beforeEach(() => {
    moxios.install();
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showContentsNavigation: true });
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it("renders practice name, ODS code and address correctly", async () => {
    const expectedODSPracticeData = {
      odsCode: "B86030",
      town: "Leeds",
      postCode: "LS6 2AF",
      lines: {
        line1: "1 Shire Oak Street",
        line2: "Headingley",
      },
    };

    const { getByText, getByRole } = render(
      <PracticeDownloadData pageContext={practicePageContext} />
    );

    await waitFor(() => {
      const expectedPracticeHeading = getByRole("heading", {
        name: /Burton Croft Surgery - B86030/,
        level: 1,
      });
      expect(expectedPracticeHeading).toBeInTheDocument();
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

  it("displays only organisation ODS code when the name is not provided", () => {
    const { getByRole } = render(
      <PracticeDownloadData
        pageContext={{
          ...practicePageContext,
          practice: {
            ...practicePageContext.practice,
            odsCode: "B86031",
            name: "",
          },
        }}
      />
    );

    const expectedPracticeHeading = getByRole("heading", {
      name: /B86031/,
      level: 1,
    });

    expect(expectedPracticeHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <PracticeDownloadData pageContext={practicePageContext} />
    );

    const pageTitle = getByRole("heading", {
      name: "Download data",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <PracticeDownloadData pageContext={practicePageContext} />
    );

    const pageDescription = getByText(
      /To download data for this practice in CSV format/
    );
    expect(pageDescription).toBeInTheDocument();
  });

  it("displays contents navigation", () => {
    const { getByRole } = render(
      <PracticeDownloadData pageContext={practicePageContext} />
    );

    const contentsHeader = getByRole("heading", {
      name: "Contents",
      level: 2,
    });
    const labelText = getByRole("link", {
      name: "GP2GP transfers requested",
    });

    expect(contentsHeader).toBeInTheDocument();
    expect(labelText).toBeInTheDocument();
  });
});

describe("PracticeDownloadData template - showContentsNavigation feature toggle is off", () => {
  beforeEach(() => {
    moxios.install();
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showContentsNavigation: false });
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it("renders practice name, ODS code and address correctly", async () => {
    const expectedODSPracticeData = {
      odsCode: "B86030",
      town: "Leeds",
      postCode: "LS6 2AF",
      lines: {
        line1: "1 Shire Oak Street",
        line2: "Headingley",
      },
    };

    const { getByText, getByRole } = render(
      <PracticeDownloadData pageContext={practicePageContext} />
    );

    await waitFor(() => {
      const expectedPracticeHeading = getByRole("heading", {
        name: /Burton Croft Surgery - B86030/,
        level: 1,
      });
      expect(expectedPracticeHeading).toBeInTheDocument();
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

  it("displays only organisation ODS code when the name is not provided", () => {
    const { getByRole } = render(
      <PracticeDownloadData
        pageContext={{
          ...practicePageContext,
          practice: {
            ...practicePageContext.practice,
            odsCode: "B86031",
            name: "",
          },
        }}
      />
    );

    const expectedPracticeHeading = getByRole("heading", {
      name: /B86031/,
      level: 1,
    });

    expect(expectedPracticeHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <PracticeDownloadData pageContext={practicePageContext} />
    );

    const pageTitle = getByRole("heading", {
      name: "Download data",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("does not display contents navigation", () => {
    const { queryByRole } = render(
      <PracticeDownloadData pageContext={practicePageContext} />
    );

    const contentsHeader = queryByRole("heading", {
      name: "Contents",
      level: 2,
    });
    const labelText = queryByRole("link", {
      name: "GP2GP transfers requested",
    });

    expect(contentsHeader).not.toBeInTheDocument();
    expect(labelText).not.toBeInTheDocument();
  });
});
