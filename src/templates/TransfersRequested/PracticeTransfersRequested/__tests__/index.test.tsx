import React from "react";
import moxios from "moxios";
import { render, within } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import PracticeTransfersRequested from "../index";
import { mockAPIResponse } from "../../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../../__mocks__/ODSPortalBuilder";
import userEvent from "@testing-library/user-event";

jest.mock("no-scroll");

function queryResult(
  odsCode: string = "B86031",
  name: string = "BURTON CROFT SURGERY"
) {
  return {
    allFile: {
      edges: [
        {
          node: {
            childOrganisationsJson: {
              practices: [
                {
                  odsCode: odsCode,
                  name: name,
                  metrics: [
                    {
                      year: 2019,
                      month: 11,
                      requestedTransfers: {
                        requestedCount: 22,
                        receivedPercentOfRequested: 90.9,
                        failuresTotalPercentOfRequested: 9.1,
                      },
                    },
                    {
                      year: 2019,
                      month: 10,
                      requestedTransfers: {
                        requestedCount: 15,
                        receivedPercentOfRequested: 100,
                        failuresTotalPercentOfRequested: 0.0,
                      },
                    },
                    {
                      year: 2019,
                      month: 9,
                      requestedTransfers: {
                        requestedCount: 30,
                        receivedPercentOfRequested: 53.3,
                        failuresTotalPercentOfRequested: 0.0,
                      },
                    },
                  ],
                },
              ],
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
  dataUpdatedDate: "2020-02-24 16:51:21.353977",
  practiceOdsCode: "B86030",
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

  const practiceMetrics =
    queryResult().allFile.edges[0].node.childOrganisationsJson.practices[0]
      .metrics;

  it("renders practice details correctly", async () => {
    const expectedODSPracticeData = {
      odsCode: "B86031",
      town: "Leeds",
      postCode: "LS6 2AF",
      lines: {
        line1: "1 Shire Oak Street",
        line2: "Headingley",
      },
    };

    const { getByText, getByRole } = render(
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
    );

    await waitFor(() => {
      const expectedPracticeHeading = getByRole("heading", {
        name: /Burton Croft Surgery - B86031/,
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
        pageContext={practicePageContext}
        data={queryResult("B86031", "")}
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
    );

    const transfersReceived =
      queryResult().allFile.edges[0].node.childOrganisationsJson.practices[0]
        .metrics[0].requestedTransfers;

    expect(getByText(transfersReceived.requestedCount)).toBeInTheDocument();
    expect(getByText("90.9%")).toBeInTheDocument();
    expect(getByText("9.1%")).toBeInTheDocument();
  });

  it("renders metrics for multiple months correctly", () => {
    const { getByText } = render(
      <PracticeTransfersRequested
        pageContext={practicePageContext}
        data={queryResult()}
      />
    );

    const monthStrings = ["November 2019", "October 2019", "September 2019"];

    practiceMetrics.forEach((metric, i) => {
      const transfersRequested = metric.requestedTransfers;

      expect(getByText(monthStrings[i])).toBeInTheDocument();
      expect(getByText(transfersRequested.requestedCount)).toBeInTheDocument();
    });
  });

  it("renders placeholders when there are no transfers", () => {
    const queryResult = {
      allFile: {
        edges: [
          {
            node: {
              childOrganisationsJson: {
                practices: [
                  {
                    odsCode: "B86030",
                    name: "BURTON CROFT SURGERY",
                    metrics: [
                      {
                        year: 2019,
                        month: 11,
                        requestedTransfers: {
                          requestedCount: 0,
                          receivedPercentOfRequested: null,
                          failuresTotalPercentOfRequested: null,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    };

    const practicePageContextNoTransferData = {
      dataUpdatedDate: "2020-02-24 16:51:21.353977",
      practiceOdsCode: "B86030",
      layout: "general",
    };

    const { getAllByText } = render(
      <PracticeTransfersRequested
        pageContext={practicePageContextNoTransferData}
        data={queryResult}
      />
    );

    const dashElements = getAllByText("n/a");
    expect(dashElements[0]).toBeInTheDocument();
    expect(dashElements.length).toBe(2);
  });
});
