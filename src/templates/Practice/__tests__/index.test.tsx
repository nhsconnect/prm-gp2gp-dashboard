import React from "react";
import moxios from "moxios";
import { render, within } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import Practice from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";
import Ccg from "../../Ccg";

jest.mock("../../../library/hooks/useFeatureToggle");

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
          receivedCount: 16,
          integratedCount: 15,
          integratedWithin3DaysCount: 10,
          integratedWithin8DaysCount: 2,
          integratedBeyond8DaysCount: 3,
          awaitingIntegrationCount: 1,
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

  describe("showDefinitionsModals toggle on", () => {
    beforeEach(() => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ showDefinitionsModals: true });
    });

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
        const transfersRequested = metric.requestedTransfers;

        expect(getByText(monthStrings[i])).toBeInTheDocument();
        expect(getByText(transfersRequested.receivedCount)).toBeInTheDocument();
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
      expect(getByText("13.6%")).toBeInTheDocument();
    });

    it("displays expander with the correct content", () => {
      const { getByText } = render(
        <Practice pageContext={practicePageContext} />
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
        <Practice pageContext={practicePageContext} />
      );

      const allColumnHeaders = getAllByRole("columnheader");

      expect(allColumnHeaders[0]).toHaveTextContent("Month");
      expect(allColumnHeaders[1]).toHaveTextContent("Transfers received");
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
      } = render(<Practice pageContext={practicePageContext} />);

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
        <Practice pageContext={practicePageContext} />
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
        <Practice pageContext={practicePageContext} />
      );

      const within8DaysHeader = getByRole("columnheader", {
        name: /Integrated within 8 days/,
      });

      const within8DaysHeaderButton =
        within(within8DaysHeader).getByRole("button");
      userEvent.click(within8DaysHeaderButton);

      const within8DaysModal = await findByLabelText(
        "Integrated within 8 days"
      );
      expect(within8DaysModal).toBeInTheDocument();
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
      expect(dashElements.length).toBe(3);
    });
  });

  describe("showDefinitionsModals toggle off", () => {
    beforeEach(() => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ showDefinitionsModals: false });
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
        const transfersRequested = metric.requestedTransfers;

        expect(getByText(monthStrings[i])).toBeInTheDocument();
        expect(getByText(transfersRequested.receivedCount)).toBeInTheDocument();
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
      expect(getByText("13.6%")).toBeInTheDocument();
    });

    it("displays expander with the correct content", () => {
      const { getByText } = render(
        <Practice pageContext={practicePageContext} />
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
        <Practice pageContext={practicePageContext} />
      );

      const allColumnHeaders = getAllByRole("columnheader");

      expect(allColumnHeaders[0]).toHaveTextContent("Month");
      expect(allColumnHeaders[1]).toHaveTextContent("Transfers received");
      expect(allColumnHeaders[2]).toHaveTextContent("Integrated within 3 days");
      expect(allColumnHeaders[3]).toHaveTextContent("Integrated within 8 days");
      expect(allColumnHeaders[4]).toHaveTextContent(
        "Not integrated within 8 days"
      );

      expect(allColumnHeaders.length).toBe(5);
    });

    it("does not display help icons in headers", () => {
      const { getAllByRole } = render(
        <Practice pageContext={practicePageContext} />
      );

      const allColumnHeaders = getAllByRole("columnheader");

      allColumnHeaders.forEach((columnHeader) => {
        expect(
          within(columnHeader).queryByRole("button", {
            name: "Open modal with definition",
          })
        ).not.toBeInTheDocument();
      });
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
      expect(dashElements.length).toBe(3);
    });
  });
});
