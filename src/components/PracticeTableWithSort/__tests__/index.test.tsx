import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PracticeTableWithSort } from "../";
import { SortOrder } from "../index";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
import practiceTableContent from "../../../data/content/practiceTable.json";

describe("PracticeTableWithSort component", () => {
  it("should display table heading caption with the month and year", () => {
    const tableCaptionText = "Integration times for February 2020";

    const { getByText } = render(
      <PracticeTableWithSort
        ccgPractices={practiceMetricsMock}
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
        ccgPractices={practiceMetricsMock}
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
    expect(sortBySelect).toHaveValue("beyond8DaysPercentage");
    expect(orderSelect).toHaveValue(SortOrder.DESCENDING);

    expect(allRows[1]).toHaveTextContent("Integrated beyond 8 days 47.6%");
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
        ccgPractices={practiceMetricsMock}
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
        "Successful integrations",
        "transferCount",
        SortOrder.DESCENDING,
        [
          "Successful integrations 34",
          "Successful integrations 21",
          "Successful integrations 12",
        ],
      ],
      [
        "Successful integrations",
        "transferCount",
        SortOrder.ASCENDING,
        [
          "Successful integrations 0",
          "Successful integrations 5",
          "Successful integrations 12",
        ],
      ],
      [
        "Integrated within 3 days",
        "within3DaysPercentage",
        SortOrder.DESCENDING,
        [
          "Integrated within 3 days 60%",
          "Integrated within 3 days 58.8%",
          "Integrated within 3 days 23.8%",
        ],
      ],
      [
        "Integrated within 3 days",
        "within3DaysPercentage",
        SortOrder.ASCENDING,
        [
          "Integrated within 3 days n/a",
          "Integrated within 3 days 0%",
          "Integrated within 3 days 16.7%",
        ],
      ],
      [
        "Integrated within 8 days",
        "within8DaysPercentage",
        SortOrder.DESCENDING,
        [
          "Integrated within 8 days 100%",
          "Integrated within 8 days 40%",
          "Integrated within 8 days 32.4%",
        ],
      ],
      [
        "Integrated within 8 days",
        "within8DaysPercentage",
        SortOrder.ASCENDING,
        [
          "Integrated within 8 days n/a",
          "Integrated within 8 days 28.6%",
          "Integrated within 8 days 32.4%",
        ],
      ],
      [
        "Integrated beyond 8 days",
        "beyond8DaysPercentage",
        SortOrder.DESCENDING,
        [
          "Integrated beyond 8 days 47.6%",
          "Integrated beyond 8 days 25%",
          "Integrated beyond 8 days 8.8%",
        ],
      ],
      [
        "Integrated beyond 8 days",
        "beyond8DaysPercentage",
        SortOrder.ASCENDING,
        [
          "Integrated beyond 8 days n/a",
          "Integrated beyond 8 days 0%",
          "Integrated beyond 8 days 0%",
        ],
      ],
    ];

    it.each(cases)(
      "displays practices ordered by %p field and %p order when selected",
      (columnHeader, fieldName, order, expectedSortOrder) => {
        const { getAllByRole, getByRole, queryAllByRole } = render(
          <PracticeTableWithSort
            ccgPractices={practiceMetricsMock}
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
