import React from "react";
import { render } from "@testing-library/react";
import NationalStatistics from "../national-gp2gp-statistics";

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
    paperFallback: { transferCount: 29185, transferPercentage: 13.09 },
    year: 2021,
    month: 1,
  };

  it("renders National data on GP2GP performance title", () => {
    const { getByText } = render(
      <NationalStatistics pageContext={pipelineNationalData} />
    );
    expect(getByText("National data on GP2GP performance")).toBeInTheDocument();
  });

  it("renders National statistics correctly", () => {
    const { getByText } = render(
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
  });
});
