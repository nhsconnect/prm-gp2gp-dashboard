import React from "react";
import moxios from "moxios";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import Practice from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";

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
  practice: {
    odsCode: "B86030",
    name: "BURTON CROFT SURGERY",
    metrics: [
      {
        year: 2019,
        month: 11,
        requester: {
          integrated: {
            transferCount: 20,
            within3DaysPercentage: 25,
            within8DaysPercentage: 60,
            beyond8DaysPercentage: 15,
          },
        },
      },
      {
        year: 2019,
        month: 10,
        requester: {
          integrated: {
            transferCount: 10,
            within3DaysPercentage: 50,
            within8DaysPercentage: 24,
            beyond8DaysPercentage: 26,
          },
        },
      },
      {
        year: 2019,
        month: 9,
        requester: {
          integrated: {
            transferCount: 30,
            within3DaysPercentage: 42,
            within8DaysPercentage: 19,
            beyond8DaysPercentage: 39,
          },
        },
      },
    ],
  },
  layout: "general",
};

describe("Practice template", () => {
  beforeEach(() => {
    moxios.install();
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);
  });

  afterAll(() => {
    moxios.uninstall();
  });

  const practiceMetrics = practicePageContext.practice.metrics;

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

    const { getByText, getByRole } = render(
      <Practice pageContext={practicePageContext} />
    );

    await waitFor(() => {
      const expectedPracticeHeading = getByRole("heading", {
        name: "Burton Croft Surgery - B86030",
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

  it("does not render practice address when API responds with an error", async () => {
    const statusCode = 500;
    mockAPIResponse(statusCode);

    const { queryByTestId, getByRole } = render(
      <Practice pageContext={practicePageContext} />
    );

    await waitFor(() => {
      const expectedPracticeHeading = getByRole("heading", {
        name: "Burton Croft Surgery - B86030",
        level: 1,
      });
      expect(expectedPracticeHeading).toBeInTheDocument();
      expect(
        queryByTestId("organisation-details-address")
      ).not.toBeInTheDocument();
    });
  });

  it("displays table title correctly", () => {
    const { getByRole } = render(
      <Practice pageContext={practicePageContext} />
    );

    const tableTitle = getByRole("heading", {
      name: "Integration times",
      level: 2,
    });

    expect(tableTitle).toBeInTheDocument();
  });

  it("renders metrics for multiple months correctly", () => {
    const { getByText } = render(
      <Practice pageContext={practicePageContext} />
    );

    const monthStrings = ["November 2019", "October 2019", "September 2019"];

    practiceMetrics.forEach((metric, i) => {
      const integratedMetrics = metric.requester.integrated;

      expect(getByText(monthStrings[i])).toBeInTheDocument();
      expect(getByText(integratedMetrics.transferCount)).toBeInTheDocument();
      expect(
        getByText(`${integratedMetrics.within3DaysPercentage}%`)
      ).toBeInTheDocument();
      expect(
        getByText(`${integratedMetrics.within8DaysPercentage}%`)
      ).toBeInTheDocument();
      expect(
        getByText(`${integratedMetrics.beyond8DaysPercentage}%`)
      ).toBeInTheDocument();
    });
  });

  it("displays expander with the correct content", () => {
    const { getByText } = render(
      <Practice pageContext={practicePageContext} />
    );

    const expanderTitle = getByText("Why integrate within 8 days");
    const expanderContent = getByText(
      "This increases burden on both the sending and receiving",
      { exact: false }
    );
    expect(expanderTitle).toBeInTheDocument();
    expect(expanderContent).not.toBeVisible();

    userEvent.click(expanderTitle);
    expect(expanderContent).toBeVisible();
  });

  it("displays table headers correctly", () => {
    const { getAllByRole } = render(
      <Practice pageContext={practicePageContext} />
    );

    const allColumnHeaders = getAllByRole("columnheader");

    expect(allColumnHeaders[0]).toHaveTextContent("Month");
    expect(allColumnHeaders[1]).toHaveTextContent("Successful integrations");
    expect(allColumnHeaders[2]).toHaveTextContent("Integrated within 3 days");
    expect(allColumnHeaders[3]).toHaveTextContent("Integrated within 8 days");
    expect(allColumnHeaders[4]).toHaveTextContent("Integrated beyond 8 days");

    expect(allColumnHeaders.length).toBe(5);
  });

  it("renders placeholders when there is no transfers", () => {
    const practicePageContextNoTransferData = {
      practice: {
        odsCode: "B86030",
        name: "BURTON CROFT SURGERY",
        metrics: [
          {
            year: 2019,
            month: 11,
            requester: {
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
          },
        ],
      },
      layout: "general",
    };

    const { getAllByText } = render(
      <Practice pageContext={practicePageContextNoTransferData} />
    );

    const dashElements = getAllByText("n/a");
    expect(dashElements[0]).toBeInTheDocument();
    expect(dashElements.length).toBe(3);
  });
});
