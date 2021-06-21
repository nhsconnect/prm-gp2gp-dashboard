import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CcgPageContent } from "../";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

describe("CcgPageContent component", () => {
  it("displays multiple valid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];
    const validPractices = [
      ...practiceMetricsMock,
      {
        odsCode: "B12345",
        name: "GP Practice 2",
        metrics: [
          {
            year: 2020,
            month: 1,
            requester: {
              integrated: {
                transferCount: 7,
                within3Days: 0,
                within8Days: 2,
                beyond8Days: 5,
                within3DaysPercentage: 0,
                within8DaysPercentage: 28.6,
                beyond8DaysPercentage: 71.4,
              },
            },
          },
        ],
      },
    ];

    const { getByText, getAllByRole } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    const allRows = getAllByRole("row");

    expect(getByText("GP Practice - A12345")).toBeInTheDocument();
    expect(getByText("GP Practice 2 - B12345")).toBeInTheDocument();
    expect(allRows[1]).toHaveTextContent("Successful integrations 7");
    expect(allRows[1]).toHaveTextContent("Integrated within 3 days 0%");
    expect(allRows[1]).toHaveTextContent("Integrated within 8 days 28.6%");
    expect(allRows[1]).toHaveTextContent("Integrated beyond 8 days 71.4%");
  });

  it("filters out invalid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];

    const { queryByText, getByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("GP Practice - A12345")).toBeInTheDocument();
    expect(queryByText("GP Practice 2 - B12345")).not.toBeInTheDocument();
  });

  it("displays a message if there are no valid practices", () => {
    const ccgPractices = [{ OrgId: "A12360", Name: "GP Practice" }];

    const { getByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("No GP practices found")).toBeInTheDocument();
  });

  it("displays CCG 'About this data' header correctly", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("About this data")).toBeInTheDocument();
  });

  it("should display expander with the correct content", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
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

  it("does not display 'About this data' and 8 Day SLA expander when there are no GP practices", () => {
    const ccgPractices = [{ OrgId: "A12360", Name: "GP Practice" }];

    const { getByText, queryByText } = render(
      <CcgPageContent
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("No GP practices found")).toBeInTheDocument();
    expect(queryByText("About this data")).not.toBeInTheDocument();

    const expanderTitle = "Why integrate within 8 days?";
    const expanderContent =
      "This increases the burden on both the sending and receiving";
    expect(queryByText(expanderTitle)).not.toBeInTheDocument();
    expect(queryByText(expanderContent)).not.toBeInTheDocument();
  });
});
