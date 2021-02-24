import React from "react";
import { render } from "@testing-library/react";
import NationalStatistics from "../national-gp2gp-statistics";
describe("National GP2GP Statistics template", () => {
  it("renders National data on GP2GP performance title", () => {
    const { getByText } = render(<NationalStatistics />);
    expect(getByText("National data on GP2GP performance")).toBeInTheDocument();
  });
});
