import React from "react";
import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";

import { useJavascriptEnabled } from "../../library/hooks/useJavascriptEnabled";
import Index from "../index";

jest.mock("../../library/hooks/useJavascriptEnabled");

jest.mock(
  "../../data/organisations/practiceMetrics.json",
  () => ({
    practices: [
      { odsCode: "A12345", name: "Test Practice", metrics: [] },
      { odsCode: "X99999", name: "Second Practice", metrics: [] },
    ],
    ccgs: [
      { odsCode: "12A", name: "Test CCG", practices: ["A12345"] },
      { odsCode: "13B", name: "Second CCG", practices: ["X99999"] },
    ],
  }),
  { virtual: true }
);

describe("Homepage", () => {
  it("displays organisational search when javascript is enabled", () => {
    when(mocked(useJavascriptEnabled))
      .calledWith()
      .mockReturnValue({ hasJavascriptEnabled: true });
    const { getByRole, queryByRole } = render(<Index />);

    const organisationSearchHeading = getByRole("heading", {
      name: "Search",
      level: 2,
    });

    const ccgListHeading = queryByRole("heading", {
      name: "CCG A to Z",
      level: 2,
    });
    expect(organisationSearchHeading).toBeInTheDocument();
    expect(ccgListHeading).not.toBeInTheDocument();
  });
});
