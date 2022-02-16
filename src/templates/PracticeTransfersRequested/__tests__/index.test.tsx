import React from "react";
import moxios from "moxios";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";

import PracticeTransfersRequested from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";
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
      name: "B86031",
      level: 1,
    });

    expect(expectedPracticeHeading).toBeInTheDocument();
  });

  it("displays contents navigation", () => {
    const { getByRole, getByLabelText } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const contentsHeader = getByRole("heading", {
      name: "Contents",
      level: 2,
    });
    const labelText = getByLabelText("List of links to pages");

    expect(contentsHeader).toBeInTheDocument();
    expect(labelText).toBeInTheDocument();
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

  it("displays table title and description correctly", () => {
    const { getByRole, getByText } = render(
      <PracticeTransfersRequested pageContext={practicePageContext} />
    );

    const tableTitle = getByRole("heading", {
      name: "GP2GP transfers requested",
      level: 2,
    });
    const tableDescription = getByText(
      "number of registrations that triggered a GP2GP transfer",
      { exact: false }
    );
    expect(tableTitle).toBeInTheDocument();
    expect(tableDescription).toBeInTheDocument();
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
});
