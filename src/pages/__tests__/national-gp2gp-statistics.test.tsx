import React from "react";
import { render } from "@testing-library/react";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";

import NationalStatistics from "../national-gp2gp-statistics";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";

jest.mock("../../library/hooks/useFeatureToggle");
jest.mock(
  "../../data/organisations/nationalMetrics.json",
  () => ({
    metrics: [
      {
        transferCount: 223033,
        integrated: {
          transferCount: 205233,
          transferPercentage: 92.02,
          within3Days: 164341,
          within8Days: 29507,
          beyond8Days: 11385,
        },
        failed: { transferCount: 9241, transferPercentage: 4.14 },
        pending: { transferCount: 11230, transferPercentage: 5.04 },
        paperFallback: { transferCount: 31856, transferPercentage: 14.28 },
        year: 2021,
        month: 1,
      },
    ],
  }),
  { virtual: true }
);

describe("National GP2GP Statistics template", () => {
  beforeEach(() => {
    when(mocked(useFeatureToggle))
      .calledWith("F_FAILED_AND_PENDING_TRANSFERS")
      .mockReturnValue(true);
  });

  it.only("renders national statistics overview correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("National data on GP2GP performance")).toBeInTheDocument();
    expect(getByText("GP2GP Performance for January 2021")).toBeInTheDocument();
    expect(getByText("Count: 223033")).toBeInTheDocument();
  });

  it("renders integrated transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 205233")).toBeInTheDocument();
    expect(getByText("Percent: 92.02%")).toBeInTheDocument();
  });

  it("renders SLA metrics correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("164341")).toBeInTheDocument();
    expect(getByText("29507")).toBeInTheDocument();
    expect(getByText("11385")).toBeInTheDocument();
  });

  it("renders paper fallback correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 31856")).toBeInTheDocument();
    expect(getByText("Percent: 14.28%")).toBeInTheDocument();
  });

  it("renders failed transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 9241")).toBeInTheDocument();
    expect(getByText("Percent: 4.14%")).toBeInTheDocument();
  });

  it("renders pending transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 11230")).toBeInTheDocument();
    expect(getByText("Percent: 5.04%")).toBeInTheDocument();
  });

  it("renders National statistics correctly when F_FAILED_AND_PENDING_TRANSFERS is toggled off", () => {
    when(mocked(useFeatureToggle))
      .calledWith("F_FAILED_AND_PENDING_TRANSFERS")
      .mockReturnValue(false);

    const { getByText, queryByText } = render(<NationalStatistics />);
    expect(getByText("GP2GP Performance for January 2021")).toBeInTheDocument();
    expect(getByText("Count: 223033")).toBeInTheDocument();

    expect(getByText("Count: 205233")).toBeInTheDocument();
    expect(getByText("Percent: 92.02%")).toBeInTheDocument();

    expect(getByText("164341")).toBeInTheDocument();
    expect(getByText("29507")).toBeInTheDocument();
    expect(getByText("11385")).toBeInTheDocument();

    expect(getByText("Count: 31856")).toBeInTheDocument();
    expect(getByText("Percent: 14.28%")).toBeInTheDocument();

    expect(queryByText("Count: 9241")).not.toBeInTheDocument();
    expect(queryByText("Percent: 4.14%")).not.toBeInTheDocument();

    expect(queryByText("Count: 11230")).not.toBeInTheDocument();
    expect(queryByText("Percent: 5.04%")).not.toBeInTheDocument();
  });
});
