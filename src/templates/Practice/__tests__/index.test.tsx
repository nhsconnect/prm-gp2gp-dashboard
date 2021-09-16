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
        requestedTransfers: {
          requestedCount: 22,
          receivedCount: 22,
          integratedCount: 0,
          integratedWithin3DaysCount: 5,
          integratedWithin8DaysCount: 12,
          integratedBeyond8DaysCount: 2,
          awaitingIntegrationCount: 1,
          technicalFailuresCount: 0,
          unclassifiedFailureCount: 0,
        },
      },
      {
        year: 2019,
        month: 10,
        requestedTransfers: {
          requestedCount: 15,
          receivedCount: 15,
          integratedCount: 15,
          integratedWithin3DaysCount: 10,
          integratedWithin8DaysCount: 2,
          integratedBeyond8DaysCount: 3,
          awaitingIntegrationCount: 0,
          technicalFailuresCount: 0,
          unclassifiedFailureCount: 0,
        },
      },
      {
        year: 2019,
        month: 9,
        requestedTransfers: {
          requestedCount: 30,
          receivedCount: 15,
          integratedCount: 15,
          integratedWithin3DaysCount: 10,
          integratedWithin8DaysCount: 2,
          integratedBeyond8DaysCount: 3,
          awaitingIntegrationCount: 0,
          technicalFailuresCount: 0,
          unclassifiedFailureCount: 0,
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
      const transfersReceived = metric.requestedTransfers;

      expect(getByText(monthStrings[i])).toBeInTheDocument();
      expect(getByText(transfersReceived.requestedCount)).toBeInTheDocument();
    });
  });

  it("renders one month of metrics correctly", () => {
    const { getByText } = render(
      <Practice pageContext={practicePageContext} />
    );

    const transfersReceived =
      practicePageContext.practice.metrics[0].requestedTransfers;

    expect(getByText(transfersReceived.requestedCount)).toBeInTheDocument();
    expect(getByText("22.7%")).toBeInTheDocument();
    expect(getByText("54.5%")).toBeInTheDocument();
    expect(getByText("9.1%")).toBeInTheDocument();
    expect(getByText("4.5%")).toBeInTheDocument();
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
    expect(allColumnHeaders[1]).toHaveTextContent("Transfers received");
    expect(allColumnHeaders[2]).toHaveTextContent("Integrated within 3 days");
    expect(allColumnHeaders[3]).toHaveTextContent("Integrated within 8 days");
    expect(allColumnHeaders[4]).toHaveTextContent("Integrated beyond 8 days");
    expect(allColumnHeaders[5]).toHaveTextContent("Awaiting integration");

    expect(allColumnHeaders.length).toBe(6);
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
            requestedTransfers: {
              requestedCount: 0,
              receivedCount: 0,
              integratedCount: 0,
              integratedWithin3DaysCount: 0,
              integratedWithin8DaysCount: 0,
              integratedBeyond8DaysCount: 0,
              awaitingIntegrationCount: 0,
              technicalFailuresCount: 0,
              unclassifiedFailureCount: 0,
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
    expect(dashElements.length).toBe(4);
  });
});
