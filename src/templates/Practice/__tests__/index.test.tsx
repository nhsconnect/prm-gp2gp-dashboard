import React from "react";
import moxios from "moxios";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";

import Practice from "..";
import { mockAPIResponse } from "../../../../__mocks__/api";
import { practiceDataBuilder } from "../../../../__mocks__/ODSPortalBuilder";
import slaMetricsContent from "../../../data/content/practiceMetrics.json";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";

jest.mock("../../../library/hooks/useFeatureToggle");

describe("Practice template", () => {
  beforeEach(() => {
    moxios.install();

    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showHistoricalData: true });
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

    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

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

  it("display table caption correctly", () => {
    const { getByText } = render(
      <Practice pageContext={practicePageContext} />
    );

    const tableCaption = getByText("Integration times");

    expect(tableCaption).toBeInTheDocument();
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
  });

  it("display table headers correctly", () => {
    const { getAllByRole } = render(
      <Practice pageContext={practicePageContext} />
    );

    const allColumnHeaders = getAllByRole("columnheader");

    expect(allColumnHeaders[0]).toHaveTextContent("Successful integrations");
    expect(allColumnHeaders[1]).toHaveTextContent("Integrated within 3 days");
    expect(allColumnHeaders[2]).toHaveTextContent("Integrated within 8 days");
    expect(allColumnHeaders[3]).toHaveTextContent("Integrated beyond 8 days");

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

describe("showHistoricalData toggled off", () => {
  beforeEach(() => {
    moxios.install();

    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showHistoricalData: false });
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

    const statusCode = 200;
    const mockedResponse = practiceDataBuilder(ODSPracticeData);
    mockAPIResponse(statusCode, mockedResponse);

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

  it("display table caption correctly", () => {
    const { getByText } = render(
      <Practice pageContext={practicePageContext} />
    );

    const tableCaption = getByText("Integration times for November 2019");

    expect(tableCaption).toBeInTheDocument();
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
  });

  it("display table headers correctly", () => {
    const { getAllByRole } = render(
      <Practice pageContext={practicePageContext} />
    );

    const allColumnHeaders = getAllByRole("columnheader");

    expect(allColumnHeaders[0]).toHaveTextContent("Successful integrations");
    expect(allColumnHeaders[1]).toHaveTextContent("Integrated within 3 days");
    expect(allColumnHeaders[2]).toHaveTextContent("Integrated within 8 days");
    expect(allColumnHeaders[3]).toHaveTextContent("Integrated beyond 8 days");

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
