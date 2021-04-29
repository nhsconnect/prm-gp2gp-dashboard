import React from "react";
import { render } from "@testing-library/react";

import { PracticeTableWithSort } from "../";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
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
      <PracticeTableWithSort filteredPractices={practiceMetricsMock} />
    );

    const tableHeading = getByRole("heading", {
      name: "Practice performance for February 2020",
      level: 3,
    });

    expect(tableHeading).toBeInTheDocument();
  });

  it("displays practices ordered by Beyond 8 day Percentage SLA", () => {
    const { getAllByRole } = render(
      <PracticeTableWithSort filteredPractices={practiceMetricsMock} />
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

  it("navigates to a practice page when a link is clicked", () => {
    const { getByRole } = render(
      <PracticeTableWithSort filteredPractices={practiceMetricsMock} />
    );

    const practicePageLink = getByRole("link", {
      name: "GP Practice | A12345",
    });

    expect(practicePageLink.getAttribute("href")).toBe("/practice/A12345");
  });
});
