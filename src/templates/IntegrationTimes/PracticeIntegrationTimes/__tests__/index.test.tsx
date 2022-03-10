import React from "react";
import moxios from "moxios";
import { render, within } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import PracticeIntegrationTimes from "../index";
import { mockAPIResponse } from "../../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../../__mocks__/ODSPortalBuilder";
import { when } from "jest-when";
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
  practice: {
    odsCode: "B86030",
    name: "BURTON CROFT SURGERY",
    ccgOdsCode: "11D",
    ccgName: "Test ccg",
    metrics: [
      {
        year: 2019,
        month: 11,
        requestedTransfers: {
          requestedCount: 22,
          receivedCount: 22,
          receivedPercentOfRequested: 100,
          integratedWithin3DaysCount: 5,
          integratedWithin3DaysPercentOfReceived: 22.7,
          integratedWithin8DaysCount: 12,
          integratedWithin8DaysPercentOfReceived: 54.6,
          notIntegratedWithin8DaysTotal: 3,
          notIntegratedWithin8DaysPercentOfReceived: 13.6,
          failuresTotalCount: 0,
          failuresTotalPercentOfRequested: 0.0,
        },
      },
      {
        year: 2019,
        month: 10,
        requestedTransfers: {
          requestedCount: 15,
          receivedCount: 15,
          receivedPercentOfRequested: 100,
          integratedWithin3DaysCount: 10,
          integratedWithin3DaysPercentOfReceived: 66.7,
          integratedWithin8DaysCount: 2,
          integratedWithin8DaysPercentOfReceived: 13.3,
          notIntegratedWithin8DaysTotal: 3,
          notIntegratedWithin8DaysPercentOfReceived: 0.2,
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
          receivedPercentOfRequested: 15.3,
          integratedWithin3DaysCount: 10,
          integratedWithin3DaysPercentOfReceived: 62.5,
          integratedWithin8DaysCount: 2,
          integratedWithin8DaysPercentOfReceived: 12.5,
          notIntegratedWithin8DaysTotal: 4,
          notIntegratedWithin8DaysPercentOfReceived: 25.0,
          failuresTotalCount: 0,
          failuresTotalPercentOfRequested: 0.0,
        },
      },
    ],
  },
  layout: "navigation-contents",
};

describe("PracticeIntegrationTimes template when showContentsNavigation toggle is off", () => {
  beforeEach(() => {
    moxios.install();
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    when(jest.mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showContentsNavigation: false });
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
      <PracticeIntegrationTimes pageContext={practicePageContext} />
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

  it("displays only organisation ODS code when the name is not provided", () => {
    const { getByRole } = render(
      <PracticeIntegrationTimes
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
      name: "B86031",
      level: 1,
    });

    expect(expectedPracticeHeading).toBeInTheDocument();
  });

  it("displays page title correctly", () => {
    const { getByRole } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const tableTitle = getByRole("heading", {
      name: "Integration times for registering practice",
      level: 2,
    });

    expect(tableTitle).toBeInTheDocument();
  });

  it("renders metrics for multiple months correctly", () => {
    const { getByText } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const monthStrings = ["November 2019", "October 2019", "September 2019"];

    practiceMetrics.forEach((metric, i) => {
      const transfersRequested = metric.requestedTransfers;

      expect(getByText(monthStrings[i])).toBeInTheDocument();
      expect(getByText(transfersRequested.receivedCount)).toBeInTheDocument();
    });
  });

  it("renders one month of metrics correctly", () => {
    const { getByText } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const transfersReceived =
      practicePageContext.practice.metrics[0].requestedTransfers;
    expect(getByText(transfersReceived.receivedCount)).toBeInTheDocument();
    expect(getByText("22.7%")).toBeInTheDocument();
    expect(getByText("54.6%")).toBeInTheDocument();
    expect(getByText("13.6%")).toBeInTheDocument();
  });

  it("displays expander with the correct content", () => {
    const { getByText } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const expanderTitle = getByText("Why integrate within 8 days");
    const expanderContent = getByText(
      "Unnecessary printing causes avoidable work and expense",
      { exact: false }
    );
    expect(expanderTitle).toBeInTheDocument();
    expect(expanderContent).not.toBeVisible();

    userEvent.click(expanderTitle);
    expect(expanderContent).toBeVisible();
  });

  it("displays table headers correctly", () => {
    const { getAllByRole } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const allColumnHeaders = getAllByRole("columnheader");

    expect(allColumnHeaders[0]).toHaveTextContent("Month");
    expect(allColumnHeaders[1]).toHaveTextContent("GP2GP transfers received");
    expect(allColumnHeaders[2]).toHaveTextContent("Integrated within 3 days");
    expect(allColumnHeaders[3]).toHaveTextContent("Integrated within 8 days");
    expect(allColumnHeaders[4]).toHaveTextContent(
      "Not integrated within 8 days"
    );

    expect(allColumnHeaders.length).toBe(5);
  });

  it("displays modal with definitions when icon is clicked", async () => {
    const {
      findByText,
      findAllByText,
      queryByText,
      queryAllByText,
      getByRole,
    } = render(<PracticeIntegrationTimes pageContext={practicePageContext} />);

    expect(
      queryByText(/transfers received that were not integrated within 8 days/)
    ).not.toBeInTheDocument();
    expect(
      queryAllByText(/Unnecessary printing causes avoidable work/)
    ).toHaveLength(1);

    const transfersReceivedHeader = getByRole("columnheader", {
      name: /Not integrated within 8 days/,
    });

    const transfersReceivedModalButton = within(
      transfersReceivedHeader
    ).getByRole("button");
    userEvent.click(transfersReceivedModalButton);

    expect(
      await findByText(
        /transfers received that were not integrated within 8 days/
      )
    ).toBeInTheDocument();
    expect(
      await findAllByText(/Unnecessary printing causes avoidable work/)
    ).toHaveLength(2);
  });

  it("displays help icons for all relevant headers", () => {
    const { getAllByRole } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
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
    expect(
      within(allColumnHeaders[4]).getByRole("button", buttonOptions)
    ).toBeInTheDocument();
  });

  it("labels modal with content title", async () => {
    const { getByRole, findByLabelText } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const within8DaysHeader = getByRole("columnheader", {
      name: /Integrated within 8 days/,
    });

    const within8DaysHeaderButton =
      within(within8DaysHeader).getByRole("button");
    userEvent.click(within8DaysHeaderButton);

    const within8DaysModal = await findByLabelText("Integrated within 8 days");
    expect(within8DaysModal).toBeInTheDocument();
  });

  it("renders placeholders when there is no transfers", () => {
    const practicePageContextNoTransferData = {
      practice: {
        odsCode: "B86030",
        name: "BURTON CROFT SURGERY",
        ccgOdsCode: "11D",
        ccgName: "Test ccg",
        metrics: [
          {
            year: 2019,
            month: 11,
            requestedTransfers: {
              requestedCount: 0,
              receivedCount: 0,
              integratedWithin3DaysCount: 0,
              integratedWithin8DaysCount: 0,
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
      <PracticeIntegrationTimes
        pageContext={practicePageContextNoTransferData}
      />
    );

    const dashElements = getAllByText("n/a");
    expect(dashElements[0]).toBeInTheDocument();
    expect(dashElements.length).toBe(3);
  });

  it("does not display contents navigation", () => {
    const { queryByRole } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const contentsHeader = queryByRole("heading", {
      name: "Contents",
      level: 2,
    });
    const contentsLink = queryByRole("link", {
      name: "GP2GP transfers requested",
    });

    expect(contentsHeader).not.toBeInTheDocument();
    expect(contentsLink).not.toBeInTheDocument();
  });
});

describe("PracticeIntegrationTimes template when showContentsNavigation toggle is on", () => {
  beforeEach(() => {
    moxios.install();
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    when(jest.mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showContentsNavigation: true });
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
      <PracticeIntegrationTimes pageContext={practicePageContext} />
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
      <PracticeIntegrationTimes
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

  it("displays table title correctly", () => {
    const { getByRole } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const tableTitle = getByRole("heading", {
      name: "Integration times for registering practice",
      level: 2,
    });

    expect(tableTitle).toBeInTheDocument();
  });

  it("renders metrics for multiple months correctly", () => {
    const { getByText } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const monthStrings = ["November 2019", "October 2019", "September 2019"];

    practiceMetrics.forEach((metric, i) => {
      const transfersRequested = metric.requestedTransfers;

      expect(getByText(monthStrings[i])).toBeInTheDocument();
      expect(getByText(transfersRequested.receivedCount)).toBeInTheDocument();
    });
  });

  it("renders one month of metrics correctly", () => {
    const { getByText } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const transfersReceived =
      practicePageContext.practice.metrics[0].requestedTransfers;

    expect(getByText(transfersReceived.requestedCount)).toBeInTheDocument();
    expect(getByText("22.7%")).toBeInTheDocument();
    expect(getByText("54.6%")).toBeInTheDocument();
    expect(getByText("13.6%")).toBeInTheDocument();
  });

  it("displays expander with the correct content", () => {
    const { getByText } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const expanderTitle = getByText("Why integrate within 8 days");
    const expanderContent = getByText(
      "Unnecessary printing causes avoidable work and expense",
      { exact: false }
    );
    expect(expanderTitle).toBeInTheDocument();
    expect(expanderContent).not.toBeVisible();

    userEvent.click(expanderTitle);
    expect(expanderContent).toBeVisible();
  });

  it("displays table headers correctly", () => {
    const { getAllByRole } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const allColumnHeaders = getAllByRole("columnheader");

    expect(allColumnHeaders[0]).toHaveTextContent("Month");
    expect(allColumnHeaders[1]).toHaveTextContent("GP2GP transfers received");
    expect(allColumnHeaders[2]).toHaveTextContent("Integrated within 3 days");
    expect(allColumnHeaders[3]).toHaveTextContent("Integrated within 8 days");
    expect(allColumnHeaders[4]).toHaveTextContent(
      "Not integrated within 8 days"
    );

    expect(allColumnHeaders.length).toBe(5);
  });

  it("displays modal with definitions when icon is clicked", async () => {
    const {
      findByText,
      findAllByText,
      queryByText,
      queryAllByText,
      getByRole,
    } = render(<PracticeIntegrationTimes pageContext={practicePageContext} />);

    const notInt8daysContent =
      /transfers received that were not integrated within 8 days/;
    const pageAndModalContent = /Unnecessary printing causes avoidable work/;

    expect(queryByText(notInt8daysContent)).not.toBeInTheDocument();

    expect(queryAllByText(pageAndModalContent)).toHaveLength(1);

    const notInt8daysHeader = getByRole("columnheader", {
      name: /Not integrated within 8 days/,
    });

    const notInt8daysModalButton =
      within(notInt8daysHeader).getByRole("button");
    userEvent.click(notInt8daysModalButton);

    expect(await findByText(notInt8daysContent)).toBeInTheDocument();
    expect(await findAllByText(pageAndModalContent)).toHaveLength(2);
  });

  it("displays help icons for all relevant headers", () => {
    const { getAllByRole } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
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
    expect(
      within(allColumnHeaders[4]).getByRole("button", buttonOptions)
    ).toBeInTheDocument();
  });

  it("labels modal with content title", async () => {
    const { getByRole, findByLabelText } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
    );

    const within8DaysHeader = getByRole("columnheader", {
      name: /Integrated within 8 days/,
    });

    const within8DaysHeaderButton =
      within(within8DaysHeader).getByRole("button");
    userEvent.click(within8DaysHeaderButton);

    const within8DaysModal = await findByLabelText("Integrated within 8 days");
    expect(within8DaysModal).toBeInTheDocument();
  });

  it("renders placeholders when there are no transfers", () => {
    const practicePageContextNoTransferData = {
      practice: {
        odsCode: "B86030",
        name: "BURTON CROFT SURGERY",
        ccgOdsCode: "11D",
        ccgName: "Test ccg",
        metrics: [
          {
            year: 2019,
            month: 11,
            requestedTransfers: {
              requestedCount: 0,
              receivedCount: 0,
              integratedWithin3DaysCount: 0,
              integratedWithin8DaysCount: 0,
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
      <PracticeIntegrationTimes
        pageContext={practicePageContextNoTransferData}
      />
    );

    const dashElements = getAllByText("n/a");
    expect(dashElements[0]).toBeInTheDocument();
    expect(dashElements.length).toBe(3);
  });

  it("displays contents navigation", () => {
    const { getByRole } = render(
      <PracticeIntegrationTimes pageContext={practicePageContext} />
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
