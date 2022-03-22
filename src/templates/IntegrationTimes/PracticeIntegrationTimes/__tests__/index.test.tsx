import React from "react";
import moxios from "moxios";
import { render, within } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import PracticeIntegrationTimes from "../index";
import { mockAPIResponse } from "../../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../../__mocks__/ODSPortalBuilder";

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
                        receivedCount: 22,
                        integratedWithin3DaysPercentOfReceived: 22.7,
                        integratedWithin8DaysPercentOfReceived: 54.6,
                        notIntegratedWithin8DaysPercentOfReceived: 13.6,
                      },
                    },
                    {
                      year: 2019,
                      month: 10,
                      requestedTransfers: {
                        receivedCount: 15,
                        integratedWithin3DaysPercentOfReceived: 66.7,
                        integratedWithin8DaysPercentOfReceived: 13.3,
                        notIntegratedWithin8DaysPercentOfReceived: 0.2,
                      },
                    },
                    {
                      year: 2019,
                      month: 9,
                      requestedTransfers: {
                        receivedCount: 16,
                        integratedWithin3DaysPercentOfReceived: 62.5,
                        integratedWithin8DaysPercentOfReceived: 12.5,
                        notIntegratedWithin8DaysPercentOfReceived: 25.0,
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

const practicePageContext = {
  dataUpdatedDate: "2020-02-24 16:51:21.353977",
  practiceOdsCode: "B86030",
  layout: "navigation-contents",
};

describe("PracticeIntegrationTimes template", () => {
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
      <PracticeIntegrationTimes
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
      <PracticeIntegrationTimes
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

  it("displays table title correctly", () => {
    const { getByRole } = render(
      <PracticeIntegrationTimes
        pageContext={practicePageContext}
        data={queryResult()}
      />
    );

    const tableTitle = getByRole("heading", {
      name: "Integration times for registering practice",
      level: 2,
    });

    expect(tableTitle).toBeInTheDocument();
  });

  it("renders metrics for multiple months correctly", () => {
    const { getByText } = render(
      <PracticeIntegrationTimes
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeIntegrationTimes
        pageContext={practicePageContext}
        data={queryResult()}
      />
    );

    const transfersReceived =
      queryResult().allFile.edges[0].node.childOrganisationsJson.practices[0]
        .metrics[0].requestedTransfers;

    expect(getByText(transfersReceived.receivedCount)).toBeInTheDocument();
    expect(getByText("22.7%")).toBeInTheDocument();
    expect(getByText("54.6%")).toBeInTheDocument();
    expect(getByText("13.6%")).toBeInTheDocument();
  });

  it("displays expander with the correct content", () => {
    const { getByText } = render(
      <PracticeIntegrationTimes
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
      <PracticeIntegrationTimes
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
    } = render(
      <PracticeIntegrationTimes
        pageContext={practicePageContext}
        data={queryResult()}
      />
    );

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
      <PracticeIntegrationTimes
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
    expect(
      within(allColumnHeaders[4]).getByRole("button", buttonOptions)
    ).toBeInTheDocument();
  });

  it("labels modal with content title", async () => {
    const { getByRole, findByLabelText } = render(
      <PracticeIntegrationTimes
        pageContext={practicePageContext}
        data={queryResult()}
      />
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
                          receivedCount: 0,
                          integratedWithin3DaysPercentOfReceived: null,
                          integratedWithin8DaysPercentOfReceived: null,
                          notIntegratedWithin8DaysPercentOfReceived: null,
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
      <PracticeIntegrationTimes
        pageContext={practicePageContextNoTransferData}
        data={queryResult}
      />
    );

    const dashElements = getAllByText("n/a");
    expect(dashElements[0]).toBeInTheDocument();
    expect(dashElements.length).toBe(3);
  });

  it("displays contents navigation", () => {
    const { getByRole } = render(
      <PracticeIntegrationTimes
        pageContext={practicePageContext}
        data={queryResult()}
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
