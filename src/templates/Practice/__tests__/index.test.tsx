import React from "react";
import moxios from "moxios";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import Practice from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";
import slaMetricsContent from "../../../data/content/practiceMetrics.json";

describe("Practice template", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterAll(() => {
    moxios.uninstall();
  });

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
              within3Days: 5,
              within8Days: 12,
              beyond8Days: 3,
            },
          },
        },
      ],
    },
    layout: "general",
  };

  const practiceIntegratedData =
    practicePageContext.practice.metrics[0].requester.integrated;

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
    const expectedPracticeName = "Burton Croft Surgery";

    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(
      <Practice pageContext={practicePageContext} />
    );

    await waitFor(() => {
      expect(getByText(expectedODSPracticeData.odsCode)).toBeInTheDocument();
      expect(getByText(expectedPracticeName)).toBeInTheDocument();
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
    const expectedPracticeName = "Burton Croft Surgery";
    const statusCode = 500;
    mockAPIResponse(statusCode);

    const { getByText, queryByTestId } = render(
      <Practice pageContext={practicePageContext} />
    );

    await waitFor(() => {
      expect(
        getByText(practicePageContext.practice.odsCode)
      ).toBeInTheDocument();
      expect(getByText(expectedPracticeName)).toBeInTheDocument();
      expect(
        queryByTestId("organisation-details-address")
      ).not.toBeInTheDocument();
    });
  });

  it("renders metrics correctly", async () => {
    const { getByText, getAllByText } = render(
      <Practice pageContext={practicePageContext} />
    );

    await waitFor(() => {
      expect(
        getAllByText(slaMetricsContent.tableHeaders[0])[0]
      ).toBeInTheDocument();
      expect(
        getByText(practiceIntegratedData.transferCount)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[1])[0]
      ).toBeInTheDocument();
      expect(
        getByText(`${practiceIntegratedData.within3DaysPercentage}%`)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[2])[0]
      ).toBeInTheDocument();
      expect(
        getByText(`${practiceIntegratedData.within8DaysPercentage}%`)
      ).toBeInTheDocument();
      expect(
        getAllByText(slaMetricsContent.tableHeaders[3])[0]
      ).toBeInTheDocument();
      expect(
        getByText(`${practiceIntegratedData.beyond8DaysPercentage}%`)
      ).toBeInTheDocument();
    });
  });

  it("should display expander with the correct content", async () => {
    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

    const { getByText } = render(
      <Practice pageContext={practicePageContext} />
    );

    await waitFor(() => {
      const expanderTitle = getByText("Why integrate within 8 days?");
      const expanderContent = getByText(
        "This increases the burden on both the sending and receiving",
        { exact: false }
      );
      expect(expanderTitle).toBeInTheDocument();
      expect(expanderContent).not.toBeVisible();

      userEvent.click(expanderTitle);
      expect(expanderContent).toBeVisible();
    });
  });

  it("display table headers correctly", () => {
    const { getAllByRole } = render(
      <Practice pageContext={practicePageContext} />
    );

    const allColumnHeaders = getAllByRole("columnheader");

    expect(allColumnHeaders[0]).toHaveTextContent("Successful integrations");
    expect(allColumnHeaders[1]).toHaveTextContent("Within 3 days");
    expect(allColumnHeaders[2]).toHaveTextContent("Within 8 days");
    expect(allColumnHeaders[3]).toHaveTextContent("Beyond 8 days");

    expect(allColumnHeaders.length).toBe(4);
  });

  it("renders placeholders when there is no transfers", async () => {
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

    await waitFor(() => {
      const dashElements = getAllByText("n/a");
      expect(dashElements[0]).toBeInTheDocument();
      expect(dashElements.length).toBe(3);
    });
  });
});
