import React from "react";
import { render } from "@testing-library/react";

import { PracticeTableWithSort } from "../";
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
    expect(orderSelect).toHaveValue("descending");

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

  it("displays practices ordered by Within 3 days percentage SLA when selected", () => {
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

    userEvent.selectOptions(sortBySelect, "within3DaysPercentage");

    expect(sortBySelect).toHaveValue("within3DaysPercentage");

    expect(allRows[1]).toHaveTextContent("Within 3 days 60%");
    expect(allRows[2]).toHaveTextContent("Within 3 days 58.8%");
    expect(allRows[3]).toHaveTextContent("Within 3 days 23.8%");
    expect(allRows[4]).toHaveTextContent("Within 3 days 16.7%");
    expect(allRows[5]).toHaveTextContent("Within 3 days 0%");
    expect(allRows[6]).toHaveTextContent("Within 3 days n/a");
    expect(allRows.length).toBe(7);
  });

  it("displays practices ordered by practice name in ascending order when selected", () => {
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

    userEvent.selectOptions(sortBySelect, "practiceName");
    userEvent.selectOptions(orderSelect, "ascending");

    expect(sortBySelect).toHaveValue("practiceName");
    expect(orderSelect).toHaveValue("ascending");

    expect(allRows[1]).toHaveTextContent("Fifth GP Practice");
    expect(allRows[2]).toHaveTextContent("Fourth GP Practice");
    expect(allRows[3]).toHaveTextContent("GP Practice");
    expect(allRows[4]).toHaveTextContent("Second GP Practice");
    expect(allRows[5]).toHaveTextContent("Sixth GP Practice");
    expect(allRows[6]).toHaveTextContent("Third GP Practice");
    expect(allRows.length).toBe(7);
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
          orderSelect={{ defaultValue: "descending", options: [] }}
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
          orderSelect={{ defaultValue: "descending", options: [] }}
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
  });
});
