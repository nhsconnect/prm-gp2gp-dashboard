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
        transferCount: 700000,
        integratedOnTime: { transferCount: 400000, transferPercentage: 57.14 },
        paperFallback: {
          transferCount: 300000,
          transferPercentage: 42.86,
          processFailure: {
            integratedLate: {
              transferCount: 100000,
              transferPercentage: 14.29,
            },
            transferredNotIntegrated: {
              transferCount: 100000,
              transferPercentage: 14.29,
            },
          },
          technicalFailure: {
            transferCount: 100000,
            transferPercentage: 14.29,
          },
          unclassifiedFailure: { transferCount: 0, transferPercentage: 0 },
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
    expect(getByText("Count: 700,000")).toBeInTheDocument();
  });

  it("renders integrated transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 400,000")).toBeInTheDocument();
    expect(getByText("Percent: 57.14%")).toBeInTheDocument();
  });

  it("renders paper fallback correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 300,000")).toBeInTheDocument();
    expect(getByText("Percent: 42.86%")).toBeInTheDocument();
  });

  it("renders process failure integrated late metrics correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 100,000")).toBeInTheDocument();
    expect(getByText("Percent: 14.29%")).toBeInTheDocument();
  });

  it("renders process failure transferred not integrated metrics correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 100,000")).toBeInTheDocument();
    expect(getByText("Percent: 14.29%")).toBeInTheDocument();
  });

  it("renders failed transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 100,000")).toBeInTheDocument();
    expect(getByText("Percent: 14.29%")).toBeInTheDocument();
  });
});
