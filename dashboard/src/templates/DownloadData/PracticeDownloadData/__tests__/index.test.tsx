import React from "react";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import PracticeDownloadData from "../index";
import { mockAPIResponse } from "../../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../../__mocks__/ODSPortalBuilder";
import {
  practiceWithNoName,
  practiceWithThreeMonthsMetrics,
} from "../../../../../__mocks__/practiceMetricsTestData";
import { PracticeType } from "../../../../library/types/practice.types";

jest.mock("axios");
jest.mock("no-scroll");

function queryResult(practices: PracticeType[]) {
  return {
    allFile: {
      edges: [
        {
          node: {
            childOrganisationsJson: {
              practices: practices,
            },
          },
        },
      ],
    },
  };
}

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
  practiceOdsCode: "B86030",
  dataUpdatedDate: "2020-02-24 16:51:21.353977",
};

describe("PracticeDownloadData template", () => {
  beforeEach(() => {
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);
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
      <PracticeDownloadData
        pageContext={practicePageContext}
        data={queryResult([practiceWithThreeMonthsMetrics])}
      />
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
        pageContext={practicePageContext}
        data={queryResult([practiceWithNoName])}
      />
    );

    const expectedPracticeHeading = getByRole("heading", {
      name: "NONAME123 download data",
      level: 1,
    });

    expect(expectedPracticeHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <PracticeDownloadData
        pageContext={practicePageContext}
        data={queryResult([practiceWithThreeMonthsMetrics])}
      />
    );

    const pageTitle = getByRole("heading", {
      name: "Download data",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <PracticeDownloadData
        pageContext={practicePageContext}
        data={queryResult([practiceWithThreeMonthsMetrics])}
      />
    );

    const pageDescription = getByText(
      /To download data for this practice in CSV format/
    );
    expect(pageDescription).toBeInTheDocument();
  });

  it("displays contents navigation", () => {
    const { getByRole } = render(
      <PracticeDownloadData
        pageContext={practicePageContext}
        data={queryResult([practiceWithThreeMonthsMetrics])}
      />
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
