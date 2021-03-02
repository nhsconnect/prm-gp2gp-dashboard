import React from "react";
import { render } from "@testing-library/react";

import PracticeTable from "../index";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

describe("PracticeTable component", () => {
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
            requester: {
              integrated: {
                transferCount: 7,
                within3Days: 0,
                within8Days: 2,
                beyond8Days: 5,
              },
            },
          },
        ],
      },
    ];

    const { getByText, getAllByRole } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    const allRows = getAllByRole("row");

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(getByText("GP Practice 2 | B12345")).toBeInTheDocument();
    expect(allRows[1]).toHaveTextContent("Successful integrations 7");
    expect(allRows[1]).toHaveTextContent("Within 3 days 0");
    expect(allRows[1]).toHaveTextContent("Within 8 days 2");
    expect(allRows[1]).toHaveTextContent("Beyond 8 days 5");
  });

  it("filters out invalid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];

    const { queryByText, getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(queryByText("GP Practice 2 | B12345")).not.toBeInTheDocument();
  });

  it("displays a message if there are no valid practices", () => {
    const ccgPractices = [{ OrgId: "B12345", Name: "GP Practice 2" }];
    const validPractices = [{ odsCode: "A12345", name: "GP Practice" }];

    const { getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    expect(getByText("No GP practices found")).toBeInTheDocument();
  });

  it("displays practices ordered by Beyond 8 day SLA", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "A12346", Name: "Second GP Practice" },
      { OrgId: "A12347", Name: "Third GP Practice" },
    ];

    const { getAllByRole } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    const allRows = getAllByRole("row");

    expect(allRows[1]).toHaveTextContent("Beyond 8 days 10");
    expect(allRows[2]).toHaveTextContent("Beyond 8 days 3");
    expect(allRows[3]).toHaveTextContent("Beyond 8 days 0");
  });

  it("navigates to a practice page when a link is clicked", () => {
    const ccgPractices = [{ OrgId: "A12345", Name: "GP Practice" }];

    const { getByRole } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={practiceMetricsMock}
      />
    );

    const practicePageLink = getByRole("link", {
      name: "GP Practice | A12345",
    });

    expect(practicePageLink.getAttribute("href")).toBe("/practice/A12345");
  });
});
