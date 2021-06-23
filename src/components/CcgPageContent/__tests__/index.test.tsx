import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CcgPageContent } from "../";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

describe("CcgPageContent component", () => {
  it("displays multiple CCG practices", () => {
    const ccgPractices = [
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
      <CcgPageContent ccgPractices={ccgPractices} />
    );

    const allRows = getAllByRole("row");

    expect(getByText("GP Practice - A12345")).toBeInTheDocument();
    expect(getByText("GP Practice 2 - B12345")).toBeInTheDocument();
    expect(allRows[1]).toHaveTextContent("Successful integrations 7");
    expect(allRows[1]).toHaveTextContent("Integrated within 3 days 0%");
    expect(allRows[1]).toHaveTextContent("Integrated within 8 days 28.6%");
    expect(allRows[1]).toHaveTextContent("Integrated beyond 8 days 71.4%");
  });

  it("displays CCG 'About this data' header correctly", () => {
    const { getByText } = render(
      <CcgPageContent ccgPractices={practiceMetricsMock} />
    );

    expect(getByText("About this data")).toBeInTheDocument();
  });

  it("should display expander with the correct content", () => {
    const { getByText } = render(
      <CcgPageContent ccgPractices={practiceMetricsMock} />
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
});
