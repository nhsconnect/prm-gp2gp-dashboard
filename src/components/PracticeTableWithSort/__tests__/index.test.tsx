import React from "react";
import { render } from "@testing-library/react";

import { PracticeTableWithSort } from "../";
import { SortOrder } from "../index";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
import practiceTableContent from "../../../data/content/practiceTable.json";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";

jest.mock("../../../library/hooks/useFeatureToggle");

import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";
import userEvent from "@testing-library/user-event";

describe("PracticeTableWithSort component", () => {
  beforeEach(() => {
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ practiceTableWithSort: true });
  });

  it("should display table heading with the month and year", () => {
    const { getByRole } = render(
      <PracticeTableWithSort
        filteredPractices={practiceMetricsMock}
        headers={practiceTableContent.headers}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
      />
    );

    const tableHeading = getByRole("heading", {
      name: "Practice performance for February 2020",
      level: 3,
    });

    expect(tableHeading).toBeInTheDocument();
  });

  it("displays practices ordered by Beyond 8 day Percentage SLA by default in descending order", () => {
    const { getAllByRole, getByRole } = render(
      <PracticeTableWithSort
        filteredPractices={practiceMetricsMock}
        headers={practiceTableContent.headers}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
      />
    );

    const allRows = getAllByRole("row");

    const sortBySelect = getByRole("combobox", {
      name: "Sort by",
    });
    const orderSelect = getByRole("combobox", {
      name: "Order",
    });
    expect(sortBySelect).toHaveValue("beyond8DaysPercentage");
    expect(orderSelect).toHaveValue(SortOrder.DESCENDING);

    expect(allRows[1]).toHaveTextContent("Beyond 8 days 47.6%");
    expect(allRows[2]).toHaveTextContent("Beyond 8 days 25%");
    expect(allRows[3]).toHaveTextContent("Beyond 8 days 8.8%");
    expect(allRows[4]).toHaveTextContent("Beyond 8 days 0%");
    expect(allRows[5]).toHaveTextContent("Beyond 8 days 0%");
    expect(allRows[6]).toHaveTextContent("Beyond 8 days n/a");
    expect(allRows.length).toBe(7);
  });

  it("navigates to a practice page when a link is clicked", () => {
    const { getByRole } = render(
      <PracticeTableWithSort
        filteredPractices={practiceMetricsMock}
        headers={practiceTableContent.headers}
        sortBySelect={practiceTableContent.sortBySelect}
        orderSelect={practiceTableContent.orderSelect}
      />
    );

    const practicePageLink = getByRole("link", {
      name: "GP Practice | A12345",
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
          "Practice name Third GP Practice | A12347",
          "Practice name Sixth GP Practice | A12350",
          "Practice name Second GP Practice | A12346",
        ],
      ],
      [
        "Practice name",
        "practiceName",
        SortOrder.ASCENDING,
        [
          "Practice name Fifth GP Practice | A12349",
          "Practice name Fourth GP Practice | A12348",
          "Practice name GP Practice | A12345",
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
        "Within 3 days",
        "within3DaysPercentage",
        SortOrder.DESCENDING,
        ["Within 3 days 60%", "Within 3 days 58.8%", "Within 3 days 23.8%"],
      ],
      [
        "Within 3 days",
        "within3DaysPercentage",
        SortOrder.ASCENDING,
        ["Within 3 days n/a", "Within 3 days 0%", "Within 3 days 16.7%"],
      ],
      [
        "Within 8 days",
        "within8DaysPercentage",
        SortOrder.DESCENDING,
        ["Within 8 days 100%", "Within 8 days 40%", "Within 8 days 32.4%"],
      ],
      [
        "Within 8 days",
        "within8DaysPercentage",
        SortOrder.ASCENDING,
        ["Within 8 days n/a", "Within 8 days 28.6%", "Within 8 days 32.4%"],
      ],
      [
        "Beyond 8 days",
        "beyond8DaysPercentage",
        SortOrder.DESCENDING,
        ["Beyond 8 days 47.6%", "Beyond 8 days 25%", "Beyond 8 days 8.8%"],
      ],
      [
        "Beyond 8 days",
        "beyond8DaysPercentage",
        SortOrder.ASCENDING,
        ["Beyond 8 days n/a", "Beyond 8 days 0%", "Beyond 8 days 0%"],
      ],
    ];

    it.each(cases)(
      "displays practices ordered by %p field and %p order when selected",
      (columnHeader, fieldName, order, expectedSortOrder) => {
        const { getAllByRole, getByRole } = render(
          <PracticeTableWithSort
            filteredPractices={practiceMetricsMock}
            headers={practiceTableContent.headers}
            sortBySelect={practiceTableContent.sortBySelect}
            orderSelect={practiceTableContent.orderSelect}
          />
        );

        const allRows = getAllByRole("row");

        const sortBySelect = getByRole("combobox", {
          name: "Sort by",
        });
        const orderSelect = getByRole("combobox", {
          name: "Order",
        });

        userEvent.selectOptions(sortBySelect, fieldName);
        userEvent.selectOptions(orderSelect, order);

        expect(sortBySelect).toHaveValue(fieldName);
        expect(orderSelect).toHaveValue(order);

        (expectedSortOrder as string[]).forEach(cell => {
          const sortedCell = getAllByRole("cell", {
            name: cell,
          });
          expect(sortedCell[0]).toHaveClass("sorted");
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

  describe("practiceTableWithSort toggled off", () => {
    it("should display table caption with the month and year when practiceTableWithSort feature toggle is off", () => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ practiceTableWithSort: false });

      const { getByText } = render(
        <PracticeTableWithSort
          filteredPractices={practiceMetricsMock}
          headers={practiceTableContent.headers}
          sortBySelect={{ defaultValue: "beyond8DaysPercentage", options: [] }}
          orderSelect={{ defaultValue: SortOrder.DESCENDING, options: [] }}
        />
      );

      expect(
        getByText("Practice performance for February 2020")
      ).toBeInTheDocument();
    });

    it("displays practices ordered by Beyond 8 day Percentage SLA when practiceTableWithSort feature toggle is off", () => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ practiceTableWithSort: false });

      const { getAllByRole } = render(
        <PracticeTableWithSort
          filteredPractices={practiceMetricsMock}
          headers={practiceTableContent.headers}
          sortBySelect={{ defaultValue: "beyond8DaysPercentage", options: [] }}
          orderSelect={{ defaultValue: SortOrder.DESCENDING, options: [] }}
        />
      );

      const allRows = getAllByRole("row");

      expect(allRows[1]).toHaveTextContent("Beyond 8 days 47.6%");
      expect(allRows[2]).toHaveTextContent("Beyond 8 days 25%");
      expect(allRows[3]).toHaveTextContent("Beyond 8 days 8.8%");
      expect(allRows[4]).toHaveTextContent("Beyond 8 days 0%");
      expect(allRows[5]).toHaveTextContent("Beyond 8 days 0%");
      expect(allRows[6]).toHaveTextContent("Beyond 8 days n/a");
      expect(allRows.length).toBe(7);
    });

    it("does not display sort by and order selects when practiceTableWithSort feature toggle is off", () => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ practiceTableWithSort: false });

      const { queryByRole } = render(
        <PracticeTableWithSort
          filteredPractices={practiceMetricsMock}
          headers={practiceTableContent.headers}
          sortBySelect={{
            defaultValue: "beyond8DaysPercentage",
            options: [],
          }}
          orderSelect={{ defaultValue: SortOrder.DESCENDING, options: [] }}
        />
      );

      const sortBySelect = queryByRole("combobox", {
        name: "Sort by",
      });
      const orderSelect = queryByRole("combobox", {
        name: "Order",
      });

      expect(sortBySelect).not.toBeInTheDocument();
      expect(orderSelect).not.toBeInTheDocument();
    });
  });
});
