import React from "react";
import { render } from "@testing-library/react";

import NationalStatistics from "../national-gp2gp-statistics";

jest.mock(
  "../../data/organisations/nationalMetrics.json",
  () => ({
    metrics: [
      {
        year: 2021,
        month: 7,
        transferCount: 248942,
        integratedOnTime: { transferCount: 219808, transferPercentage: 88.3 },
        paperFallback: {
          transferCount: 29134,
          transferPercentage: 11.7,
          processFailure: {
            integratedLate: {
              transferCount: 12988,
              transferPercentage: 5.22,
            },
            transferredNotIntegrated: {
              transferCount: 6860,
              transferPercentage: 2.76,
            },
          },
          technicalFailure: {
            transferCount: 8943,
            transferPercentage: 3.59,
          },
          unclassifiedFailure: { transferCount: 343, transferPercentage: 0.14 },
        },
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
      getByText("GP2GP National Performance for July 2021")
    ).toBeInTheDocument();
    expect(getByText("Count: 248,942")).toBeInTheDocument();
  });

  it("renders integrated transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 219,808")).toBeInTheDocument();
    expect(getByText("Percent: 88.3%")).toBeInTheDocument();
  });

  it("renders paper fallback correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 29,134")).toBeInTheDocument();
    expect(getByText("Percent: 11.7%")).toBeInTheDocument();
  });

  it("renders process failure integrated late metrics correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 12,988")).toBeInTheDocument();
    expect(getByText("Percent: 5.22%")).toBeInTheDocument();
  });

  it("renders process failure transferred not integrated metrics correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 6,860")).toBeInTheDocument();
    expect(getByText("Percent: 2.76%")).toBeInTheDocument();
  });

  it("renders failed transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 8,943")).toBeInTheDocument();
    expect(getByText("Percent: 3.59%")).toBeInTheDocument();
  });

  it("renders unclassified transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 343")).toBeInTheDocument();
    expect(getByText("Percent: 0.14%")).toBeInTheDocument();
  });
});
