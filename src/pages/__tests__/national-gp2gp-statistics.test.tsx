import React from "react";
import { render } from "@testing-library/react";

import NationalStatistics from "../national-gp2gp-statistics";

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
  it("renders national statistics overview correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(
      getByText("National GP2GP patient record transfers data")
    ).toBeInTheDocument();
    expect(
      getByText("GP2GP National Performance for January 2021")
    ).toBeInTheDocument();
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
});
