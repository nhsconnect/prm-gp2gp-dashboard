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
        total: 7,
        transferOutcomes: {
          integratedOnTime: { total: 4, percent: 57.14 },
          processFailure: {
            total: 2,
            percent: 28.57,
            integratedLate: { percent: 14.29, total: 1 },
            transferredNotIntegrated: { total: 1, percent: 14.29 },
          },
          technicalFailure: { total: 1, percent: 14.29 },
          unclassifiedFailure: { total: 0, percent: 0 },
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
    expect(getByText("Count: 7")).toBeInTheDocument();
  });

  it("renders integrated transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 4")).toBeInTheDocument();
    expect(getByText("Percent: 57.14%")).toBeInTheDocument();
  });

  it("renders paper fallback correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 3")).toBeInTheDocument();
    expect(getByText("Percent: 42.86%")).toBeInTheDocument();
  });

  it("renders failed transfers correctly", () => {
    const { getByText } = render(<NationalStatistics />);

    expect(getByText("Count: 1")).toBeInTheDocument();
    expect(getByText("Percent: 14.29%")).toBeInTheDocument();
  });
});
