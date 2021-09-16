import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PracticeTableWithSort } from "../";
import { SortOrder } from "../index";
import practiceMetricsPercentageMock from "../../../../__mocks__/practiceMetricsPercentageMock.json";
import practiceTableContent from "../../../data/content/practiceTable.json";

describe("PracticeTableWithSort component", () => {
  it("should display table heading caption with the month and year", () => {
    const tableCaptionText = "Integration times for February 2020";

    const { getByText } = render(
      <PracticeTableWithSort
        ccgPractices={practiceMetricsPercentageMock}
        headers={practiceTableContent.headers}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
        tableCaption={tableCaptionText}
      />
    );

    const tableCaption = getByText(`${tableCaptionText} data`);

    expect(tableCaption).toBeInTheDocument();
  });

  it("displays practices ordered by Beyond 8 day Percentage SLA by default in descending order", () => {
    const { getAllByRole, getByRole } = render(
      <PracticeTableWithSort
        ccgPractices={practiceMetricsPercentageMock}
        headers={practiceTableContent.headers}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
        tableCaption={"Some table title"}
      />
    );

    const allRows = getAllByRole("row");

    const sortBySelect = getByRole("combobox", {
      name: `Sort by${practiceTableContent.selectHiddenLabel}`,
    });
    const orderSelect = getByRole("combobox", {
      name: `Order${practiceTableContent.selectHiddenLabel}`,
    });
    expect(sortBySelect).toHaveValue("integratedBeyond8DaysPercentage");
    expect(orderSelect).toHaveValue(SortOrder.DESCENDING);

    expect(allRows[1]).toHaveTextContent("Integrated beyond 8 days 45.5%");
    expect(allRows[2]).toHaveTextContent("Integrated beyond 8 days 25%");
    expect(allRows[3]).toHaveTextContent("Integrated beyond 8 days 8.8%");
    expect(allRows[4]).toHaveTextContent("Integrated beyond 8 days 0%");
    expect(allRows[5]).toHaveTextContent("Integrated beyond 8 days 0%");
    expect(allRows[6]).toHaveTextContent("Integrated beyond 8 days n/a");
    expect(allRows.length).toBe(7);
  });

  it("navigates to a practice page when a link is clicked", () => {
    const { getByRole } = render(
      <PracticeTableWithSort
        ccgPractices={practiceMetricsPercentageMock}
        headers={practiceTableContent.headers}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
        tableCaption={"Some table title"}
      />
    );

    const practicePageLink = getByRole("link", {
      name: "GP Practice - A12345",
    });

    expect(practicePageLink.getAttribute("href")).toBe("/practice/A12345");
  });

  describe("Sorting practice table", () => {
    const cases = [
      [
        "Practice name",
        "practiceName",
        SortOrder.DESCENDING,
        [
          "Practice name Third GP Practice - A12347",
          "Practice name Sixth GP Practice - A12350",
          "Practice name Second GP Practice - A12346",
        ],
      ],
      [
        "Practice name",
        "practiceName",
        SortOrder.ASCENDING,
        [
          "Practice name Fifth GP Practice - A12349",
          "Practice name Fourth GP Practice - A12348",
          "Practice name GP Practice - A12345",
        ],
      ],
      [
        "Transfers received",
        "receivedCount",
        SortOrder.DESCENDING,
        [
          "Transfers received 34",
          "Transfers received 22",
          "Transfers received 13",
        ],
      ],
      [
        "Transfers received",
        "receivedCount",
        SortOrder.ASCENDING,
        [
          "Transfers received 0",
          "Transfers received 5",
          "Transfers received 12",
        ],
      ],
      [
        "Integrated within 3 days",
        "integratedWithin3DaysPercentage",
        SortOrder.DESCENDING,
        [
          "Integrated within 3 days 60%",
          "Integrated within 3 days 58.8%",
          "Integrated within 3 days 41.7%",
        ],
      ],
      [
        "Integrated within 3 days",
        "integratedWithin3DaysPercentage",
        SortOrder.ASCENDING,
        [
          "Integrated within 3 days n/a",
          "Integrated within 3 days 0%",
          "Integrated within 3 days 22.7%",
        ],
      ],
      [
        "Integrated within 8 days",
        "integratedWithin8DaysPercentage",
        SortOrder.DESCENDING,
        [
          "Integrated within 8 days 92.3%",
          "Integrated within 8 days 40%",
          "Integrated within 8 days 33.3%",
        ],
      ],
      [
        "Integrated within 8 days",
        "integratedWithin8DaysPercentage",
        SortOrder.ASCENDING,
        [
          "Integrated within 8 days n/a",
          "Integrated within 8 days 27.3%",
          "Integrated within 8 days 32.4%",
        ],
      ],
      [
        "Integrated beyond 8 days",
        "integratedBeyond8DaysPercentage",
        SortOrder.DESCENDING,
        [
          "Integrated beyond 8 days 45.5%",
          "Integrated beyond 8 days 25%",
          "Integrated beyond 8 days 8.8%",
        ],
      ],
      [
        "Integrated beyond 8 days",
        "integratedBeyond8DaysPercentage",
        SortOrder.ASCENDING,
        [
          "Integrated beyond 8 days n/a",
          "Integrated beyond 8 days 0%",
          "Integrated beyond 8 days 0%",
        ],
      ],
      [
        "Awaiting integration",
        "awaitingIntegrationPercentage",
        SortOrder.DESCENDING,
        [
          "Awaiting integration 7.7%",
          "Awaiting integration 4.5%",
          "Awaiting integration 0%",
        ],
      ],
      [
        "Awaiting integration",
        "awaitingIntegrationPercentage",
        SortOrder.ASCENDING,
        [
          "Awaiting integration n/a",
          "Awaiting integration 0%",
          "Awaiting integration 0%",
        ],
      ],
    ];

    it.each(cases)(
      "displays practices ordered by %p field and %p %p order when selected",
      (columnHeader, fieldName, order, expectedSortOrder) => {
        const { getAllByRole, getByRole, queryAllByRole } = render(
          <PracticeTableWithSort
            ccgPractices={practiceMetricsPercentageMock}
            headers={practiceTableContent.headers}
            sortBySelect={practiceTableContent.sortBySelect}
            orderSelect={practiceTableContent.orderSelect}
            tableCaption={"Some table title"}
          />
        );

        const allRows = getAllByRole("row");

        const sortBySelect = getByRole("combobox", {
          name: `Sort by${practiceTableContent.selectHiddenLabel}`,
        });
        const orderSelect = getByRole("combobox", {
          name: `Order${practiceTableContent.selectHiddenLabel}`,
        });

        userEvent.selectOptions(sortBySelect, fieldName);
        userEvent.selectOptions(orderSelect, order);

        expect(sortBySelect).toHaveValue(fieldName);
        expect(orderSelect).toHaveValue(order);

        (expectedSortOrder as string[]).forEach((cell, index) => {
          const sortedCell = queryAllByRole("cell", {
            name: cell,
          });

          const sortedRowheader = queryAllByRole("rowheader");

          const expectedSortedCell = sortedCell[0] || sortedRowheader[index];

          expect(expectedSortedCell).toHaveClass("sorted");
        });

        const sortedColumnHeader = getByRole("columnheader", {
          name: columnHeader as string,
        });
        expect(sortedColumnHeader.getAttribute("aria-sort")).toBe(order);

        expect(allRows[1]).toHaveTextContent(expectedSortOrder[0]);
        expect(allRows[2]).toHaveTextContent(expectedSortOrder[1]);
        expect(allRows[3]).toHaveTextContent(expectedSortOrder[2]);
        expect(allRows.length).toBe(7);
      }
    );
  });
});
