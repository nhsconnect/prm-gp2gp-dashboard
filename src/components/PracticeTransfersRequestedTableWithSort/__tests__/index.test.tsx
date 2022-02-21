import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PracticeTransfersRequestedTableWithSort } from "../";
import { SortOrder } from "../index";
import practiceMetricsPercentageMock from "../../../../__mocks__/practiceTransfersRequestedMetricsPercentageMock.json";
import practiceTableContent from "../../../data/content/practiceTransfersRequestedTable.json";

const tableHeaders = [
  { title: "Requesting practice name " },
  { title: "Transfers received " },
  { title: "GP2GP transfers received " },
  { title: "GP2GP technical failures " },
];

describe("PracticeTableWithSort component", () => {
  it("should display table heading caption with the month and year", () => {
    const tableCaptionText =
      "Integration times for registering practices - February 2020";

    const { getByText } = render(
      <PracticeTransfersRequestedTableWithSort
        ccgPractices={practiceMetricsPercentageMock}
        headers={tableHeaders}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
        tableCaption={tableCaptionText}
      />
    );

    const tableCaption = getByText(`${tableCaptionText}`);

    expect(tableCaption).toBeInTheDocument();
  });

  it("displays practices ordered by Technical Failures Percentage SLA by default in descending order", () => {
    const { getAllByRole, getByRole } = render(
      <PracticeTransfersRequestedTableWithSort
        ccgPractices={practiceMetricsPercentageMock}
        headers={tableHeaders}
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
    expect(sortBySelect).toHaveValue("failuresTotalPercentOfRequested");
    expect(orderSelect).toHaveValue(SortOrder.DESCENDING);

    expect(allRows[1]).toHaveTextContent("GP2GP technical failures 28.6%");
    expect(allRows[2]).toHaveTextContent("GP2GP technical failures 15%");
    expect(allRows[3]).toHaveTextContent("GP2GP technical failures 7.7%");
    expect(allRows[4]).toHaveTextContent("GP2GP technical failures 7.1%");
    expect(allRows[5]).toHaveTextContent("GP2GP technical failures 0%");
    expect(allRows[6]).toHaveTextContent("GP2GP technical failures n/a");
    expect(allRows.length).toBe(7);
  });

  it("navigates to a practice page when a link is clicked", () => {
    const { getByRole } = render(
      <PracticeTransfersRequestedTableWithSort
        ccgPractices={practiceMetricsPercentageMock}
        headers={tableHeaders}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
        tableCaption={"Some table title"}
      />
    );

    const practicePageLink = getByRole("link", {
      name: "GP Practice - A12345",
    });

    expect(practicePageLink.getAttribute("href")).toBe(
      "/practice/A12345/transfers-requested"
    );
  });

  describe("Sorting practice table", () => {
    const cases = [
      [
        "Requesting practice name",
        "requestingPracticeName",
        SortOrder.DESCENDING,
        [
          "Requesting practice name Third GP Practice - A12347",
          "Requesting practice name Sixth GP Practice - A12350",
          "Requesting practice name Second GP Practice - A12346",
        ],
      ],
      [
        "Requesting practice name",
        "requestingPracticeName",
        SortOrder.ASCENDING,
        [
          "Requesting practice name Fifth GP Practice - A12349",
          "Requesting practice name Fourth GP Practice - A12348",
          "Requesting practice name GP Practice - A12345",
        ],
      ],
      [
        "Transfers received",
        "requestedCount",
        SortOrder.DESCENDING,
        [
          "Transfers received 40",
          "Transfers received 22",
          "Transfers received 14",
        ],
      ],
      [
        "Transfers received",
        "requestedCount",
        SortOrder.ASCENDING,
        [
          "Transfers received 0",
          "Transfers received 7",
          "Transfers received 13",
        ],
      ],
      [
        "GP2GP transfers received",
        "receivedPercentOfRequested",
        SortOrder.DESCENDING,
        [
          "GP2GP transfers received 100%",
          "GP2GP transfers received 92.9%",
          "GP2GP transfers received 92.3%",
        ],
      ],
      [
        "GP2GP transfers received",
        "receivedPercentOfRequested",
        SortOrder.ASCENDING,
        [
          "GP2GP transfers received n/a",
          "GP2GP transfers received 71.4%",
          "GP2GP transfers received 85%",
        ],
      ],
      [
        "GP2GP technical failures",
        "failuresTotalPercentOfRequested",
        SortOrder.DESCENDING,
        [
          "GP2GP technical failures 28.6%",
          "GP2GP technical failures 15%",
          "GP2GP technical failures 7.7%",
        ],
      ],
      [
        "GP2GP technical failures",
        "failuresTotalPercentOfRequested",
        SortOrder.ASCENDING,
        [
          "GP2GP technical failures n/a",
          "GP2GP technical failures 0%",
          "GP2GP technical failures 7.1%",
        ],
      ],
    ];

    it.each(cases)(
      "displays practices ordered by %p field and %p %p order when selected",
      (columnHeader, fieldName, order, expectedSortOrder) => {
        const { getAllByRole, getByRole, queryAllByRole } = render(
          <PracticeTransfersRequestedTableWithSort
            ccgPractices={practiceMetricsPercentageMock}
            headers={tableHeaders}
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
