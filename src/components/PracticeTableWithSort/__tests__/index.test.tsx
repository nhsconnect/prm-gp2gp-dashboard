import React from "react";
import { render } from "@testing-library/react";

import { PracticeTableWithSort } from "../";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
import practiceTableContent from "../../../data/content/practiceTable.json";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";

jest.mock("../../../library/hooks/useFeatureToggle");

import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";

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
        sortByOptions={practiceTableContent.sortByOptions}
      />
    );

    const tableHeading = getByRole("heading", {
      name: "Practice performance for February 2020",
      level: 3,
    });

    expect(tableHeading).toBeInTheDocument();
  });

  it("displays practices ordered by Beyond 8 day Percentage SLA by default", () => {
    const { getAllByRole, getByRole } = render(
      <PracticeTableWithSort
        filteredPractices={practiceMetricsMock}
        headers={practiceTableContent.headers}
        sortByOptions={practiceTableContent.sortByOptions}
      />
    );

    const allRows = getAllByRole("row");
    const beyond8DaysPercentageOption = getByRole("option", {
      name: "Beyond 8 days",
    });

    expect(beyond8DaysPercentageOption).toHaveAttribute("selected");

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
        sortByOptions={practiceTableContent.sortByOptions}
      />
    );

    const practicePageLink = getByRole("link", {
      name: "GP Practice | A12345",
    });

    expect(practicePageLink.getAttribute("href")).toBe("/practice/A12345");
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
          sortByOptions={[]}
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
          sortByOptions={[]}
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
