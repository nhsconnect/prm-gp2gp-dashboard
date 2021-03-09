import React from "react";
import { render } from "@testing-library/react";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";

import NationalStatistics from "..";
import { useFeatureToggle } from "../../../library/hooks/useFeatureToggle";

jest.mock("../../../library/hooks/useFeatureToggle");

describe("National GP2GP Statistics template", () => {
  const pipelineNationalData = {
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
  };

  beforeEach(() => {
    when(mocked(useFeatureToggle))
      .calledWith("F_FAILED_AND_PENDING_TRANSFERS")
      .mockReturnValue(true);
  });

  it("renders national statistics overview correctly", () => {
    const { getByText } = render(
      <NationalStatistics pageContext={pipelineNationalData} />
    );

    expect(getByText("National data on GP2GP performance")).toBeInTheDocument();
    expect(getByText("GP2GP Performance for January 2021")).toBeInTheDocument();
    expect(
      getByText(`Count: ${pipelineNationalData.transferCount}`)
    ).toBeInTheDocument();
  });

  it("renders integrated transfers correctly", () => {
    const { getByText } = render(
      <NationalStatistics pageContext={pipelineNationalData} />
    );

    expect(
      getByText(`Count: ${pipelineNationalData.integrated.transferCount}`)
    ).toBeInTheDocument();
    expect(
      getByText(
        `Percent: ${pipelineNationalData.integrated.transferPercentage}%`
      )
    ).toBeInTheDocument();
  });

  it("renders SLA metrics correctly", () => {
    const { getByText } = render(
      <NationalStatistics pageContext={pipelineNationalData} />
    );

    expect(
      getByText(pipelineNationalData.integrated.within3Days)
    ).toBeInTheDocument();
    expect(
      getByText(pipelineNationalData.integrated.within8Days)
    ).toBeInTheDocument();
    expect(
      getByText(pipelineNationalData.integrated.beyond8Days)
    ).toBeInTheDocument();
  });

  it("renders paper fallback correctly", () => {
    const { getByText } = render(
      <NationalStatistics pageContext={pipelineNationalData} />
    );

    expect(
      getByText(`Count: ${pipelineNationalData.paperFallback.transferCount}`)
    ).toBeInTheDocument();
    expect(
      getByText(
        `Percent: ${pipelineNationalData.paperFallback.transferPercentage}%`
      )
    ).toBeInTheDocument();
  });

  it("renders failed transfers correctly", () => {
    const { getByText } = render(
      <NationalStatistics pageContext={pipelineNationalData} />
    );

    expect(
      getByText(`Count: ${pipelineNationalData.failed.transferCount}`)
    ).toBeInTheDocument();
    expect(
      getByText(`Percent: ${pipelineNationalData.failed.transferPercentage}%`)
    ).toBeInTheDocument();
  });

  it("renders pending transfers correctly", () => {
    const { getByText } = render(
      <NationalStatistics pageContext={pipelineNationalData} />
    );

    expect(
      getByText(`Count: ${pipelineNationalData.pending.transferCount}`)
    ).toBeInTheDocument();
    expect(
      getByText(`Percent: ${pipelineNationalData.pending.transferPercentage}%`)
    ).toBeInTheDocument();
  });

  it("renders National statistics correctly when F_FAILED_AND_PENDING_TRANSFERS is toggled off", () => {
    when(mocked(useFeatureToggle))
      .calledWith("F_FAILED_AND_PENDING_TRANSFERS")
      .mockReturnValue(false);

    const { getByText, queryByText } = render(
      <NationalStatistics pageContext={pipelineNationalData} />
    );
    expect(getByText("GP2GP Performance for January 2021")).toBeInTheDocument();
    expect(
      getByText(`Count: ${pipelineNationalData.transferCount}`)
    ).toBeInTheDocument();

    expect(
      getByText(`Count: ${pipelineNationalData.integrated.transferCount}`)
    ).toBeInTheDocument();
    expect(
      getByText(
        `Percent: ${pipelineNationalData.integrated.transferPercentage}%`
      )
    ).toBeInTheDocument();

    expect(
      getByText(pipelineNationalData.integrated.within3Days)
    ).toBeInTheDocument();
    expect(
      getByText(pipelineNationalData.integrated.within8Days)
    ).toBeInTheDocument();
    expect(
      getByText(pipelineNationalData.integrated.beyond8Days)
    ).toBeInTheDocument();

    expect(
      getByText(`Count: ${pipelineNationalData.paperFallback.transferCount}`)
    ).toBeInTheDocument();
    expect(
      getByText(
        `Percent: ${pipelineNationalData.paperFallback.transferPercentage}%`
      )
    ).toBeInTheDocument();

    expect(
      queryByText(`Count: ${pipelineNationalData.failed.transferCount}`)
    ).not.toBeInTheDocument();
    expect(
      queryByText(`Percent: ${pipelineNationalData.failed.transferPercentage}%`)
    ).not.toBeInTheDocument();

    expect(
      queryByText(`Count: ${pipelineNationalData.pending.transferCount}`)
    ).not.toBeInTheDocument();
    expect(
      queryByText(
        `Percent: ${pipelineNationalData.pending.transferPercentage}%`
      )
    ).not.toBeInTheDocument();
  });
});
