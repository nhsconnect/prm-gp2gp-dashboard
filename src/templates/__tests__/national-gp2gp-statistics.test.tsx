import React from "react";
import { render } from "@testing-library/react";
import NationalStatistics from "../national-gp2gp-statistics";

describe("National GP2GP Statistics template", () => {
  const pipelineNationalData = {
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
  });
});
