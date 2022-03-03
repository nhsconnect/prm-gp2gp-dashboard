import React from "react";
import moxios from "moxios";
import { render, within } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import PracticeTransfersRequested from "../index";
import { mockAPIResponse } from "../../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../../__mocks__/ODSPortalBuilder";
import userEvent from "@testing-library/user-event";

jest.mock("no-scroll");

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
          receivedCount: 20,
          integratedWithin3DaysCount: 5,
          integratedWithin8DaysCount: 12,
          integratedBeyond8DaysCount: 2,
          awaitingIntegrationCount: 1,
          technicalFailuresCount: 1,
          unclassifiedFailureCount: 1,
          receivedPercentOfRequested: 90.9,
          integratedWithin3DaysPercentOfReceived: 25.0,
          integratedWithin8DaysPercentOfReceived: 60.0,
          notIntegratedWithin8DaysTotal: 3,
          notIntegratedWithin8DaysPercentOfReceived: 15.0,
          failuresTotalCount: 2,
          failuresTotalPercentOfRequested: 9.1,
          integratedCount: 0,
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
          receivedPercentOfRequested: 100,
          integratedWithin3DaysPercentOfReceived: 66.7,
          integratedWithin8DaysPercentOfReceived: 13.3,
          notIntegratedWithin8DaysTotal: 3,
          notIntegratedWithin8DaysPercentOfReceived: 22.0,
          failuresTotalCount: 0,
          failuresTotalPercentOfRequested: 0.0,
        },
      },
      {
        year: 2019,
        month: 9,
        requestedTransfers: {
          requestedCount: 30,
          receivedCount: 16,
          integratedCount: 15,
          integratedWithin3DaysCount: 10,
          integratedWithin8DaysCount: 2,
          integratedBeyond8DaysCount: 3,
          awaitingIntegrationCount: 1,
          technicalFailuresCount: 0,
          unclassifiedFailureCount: 0,
          receivedPercentOfRequested: 53.3,
          integratedWithin3DaysPercentOfReceived: 62.5,
          integratedWithin8DaysPercentOfReceived: 12.5,
          notIntegratedWithin8DaysTotal: 4,
          notIntegratedWithin8DaysPercentOfReceived: 25,
          failuresTotalCount: 0,
          failuresTotalPercentOfRequested: 0.0,
        },
      },
    ],
  },
  layout: "general",
};

describe("PracticeTransfersRequested template", () => {
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
      <PracticeTransfersRequested pageContext={practicePageContext} />
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
      <PracticeTransfersRequested
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

  it("displays contents navigation", () => {
    const { getByRole } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const contentsHeader = getByRole("heading", {
      name: "Contents",
      level: 2,
    });

    const contentsLink = getByRole("link", {
      name: "Integration times",
    });

    expect(contentsHeader).toBeInTheDocument();
    expect(contentsLink).toBeInTheDocument();
  });

  it("displays page title and description correctly", () => {
    const { getByRole, getByText } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const pageTitle = getByRole("heading", {
      name: "GP2GP transfers requested as registering practice",
      level: 2,
    });
    const pageDescription = getByText(
      "number of registrations that triggered a GP2GP transfer",
      { exact: false }
    );
    expect(pageTitle).toBeInTheDocument();
    expect(pageDescription).toBeInTheDocument();
  });

  it("displays transfers received definitions correctly", async () => {
    const { getByRole, getByText } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );
    const definitionsText =
      "Percentage of GP2GP transfers requested between the 1st and last day of the month that failed for a technical reason.";

    const definitionsTabTitle = getByRole("button", {
      name: "Click to display content Definitions",
    });
    userEvent.click(definitionsTabTitle);

    await waitFor(() => {
      const definitionsTabContent = getByText(definitionsText, {
        exact: false,
      });
      expect(definitionsTabContent).toBeInTheDocument();
    });
  });

  it("displays expander with the correct content", () => {
    const { getByText } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const expanderTitle = getByText(
      "What happens when a GP2GP transfer fails?"
    );
    const expanderContent = getByText(
      "A task will automatically be created for the sending practice",
      { exact: false }
    );
    expect(expanderTitle).toBeInTheDocument();
    expect(expanderContent).not.toBeVisible();

    userEvent.click(expanderTitle);
    expect(expanderContent).toBeVisible();
  });

  it("displays table headers correctly", () => {
    const { getAllByRole } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const allColumnHeaders = getAllByRole("columnheader");

    expect(allColumnHeaders[0]).toHaveTextContent("Month");
    expect(allColumnHeaders[1]).toHaveTextContent(
      "Registrations that triggered GP2GP transfer"
    );
    expect(allColumnHeaders[2]).toHaveTextContent("GP2GP transfers received");
    expect(allColumnHeaders[3]).toHaveTextContent("GP2GP technical failures");
    expect(allColumnHeaders.length).toBe(4);
  });

  it("displays modal with definitions when icon is clicked", async () => {
    const {
      findByText,
      queryByText,
      queryAllByText,
      findAllByText,
      getByRole,
    } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const technicalFailureModalContent =
      /Technical failures can happen from the point the GP2GP transfer is triggered/;
    const pageAndModalContent = /percentage of GP2GP transfers/i;

    expect(queryByText(technicalFailureModalContent)).not.toBeInTheDocument();

    expect(queryAllByText(pageAndModalContent)).toHaveLength(2);

    const technicalFailuresHeader = getByRole("columnheader", {
      name: /GP2GP technical failures/,
    });

    const technicalFailuresModalButton = within(
      technicalFailuresHeader
    ).getByRole("button");
    userEvent.click(technicalFailuresModalButton);

    expect(await findByText(technicalFailureModalContent)).toBeInTheDocument();
    expect(await findAllByText(pageAndModalContent)).toHaveLength(3);
  });

  it("displays help icons for all relevant headers", () => {
    const { getAllByRole } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const allColumnHeaders = getAllByRole("columnheader");
    const buttonOptions = { name: "Open modal with definition" };

    expect(
      within(allColumnHeaders[0]).queryByRole("button", buttonOptions)
    ).not.toBeInTheDocument();
    expect(
      within(allColumnHeaders[1]).getByRole("button", buttonOptions)
    ).toBeInTheDocument();
    expect(
      within(allColumnHeaders[2]).getByRole("button", buttonOptions)
    ).toBeInTheDocument();
    expect(
      within(allColumnHeaders[3]).getByRole("button", buttonOptions)
    ).toBeInTheDocument();
  });

  it("labels modal with content title", async () => {
    const { getByRole, findByLabelText } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const transfersReceivedHeader = getByRole("columnheader", {
      name: /GP2GP transfers received/,
    });

    const transfersReceivedModalButton = within(
      transfersReceivedHeader
    ).getByRole("button");
    userEvent.click(transfersReceivedModalButton);

    const transfersReceivedModal = await findByLabelText(
      "GP2GP transfers received"
    );
    expect(transfersReceivedModal).toBeInTheDocument();
  });

  it("renders one month of metrics correctly", () => {
    const { getByText } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const transfersReceived =
      practicePageContext.practice.metrics[0].requestedTransfers;

    expect(getByText(transfersReceived.requestedCount)).toBeInTheDocument();
    expect(getByText("90.9%")).toBeInTheDocument();
    expect(getByText("9.1%")).toBeInTheDocument();
  });

  it("renders metrics for multiple months correctly", () => {
    const { getByText } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const monthStrings = ["November 2019", "October 2019", "September 2019"];

    practiceMetrics.forEach((metric, i) => {
      const transfersRequested = metric.requestedTransfers;

      expect(getByText(monthStrings[i])).toBeInTheDocument();
      expect(getByText(transfersRequested.requestedCount)).toBeInTheDocument();
    });
  });

  it("renders placeholders when there are no transfers", () => {
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
              receivedPercentOfRequested: null,
              integratedWithin3DaysPercentOfReceived: null,
              integratedWithin8DaysPercentOfReceived: null,
              notIntegratedWithin8DaysTotal: 0,
              notIntegratedWithin8DaysPercentOfReceived: null,
              failuresTotalCount: 0,
              failuresTotalPercentOfRequested: null,
            },
          },
        ],
      },
      layout: "general",
    };

    const { getAllByText } = render(
      <PracticeTransfersRequested
        pageContext={practicePageContextNoTransferData}
      />
    );

    const dashElements = getAllByText("n/a");
    expect(dashElements[0]).toBeInTheDocument();
    expect(dashElements.length).toBe(2);
  });
});