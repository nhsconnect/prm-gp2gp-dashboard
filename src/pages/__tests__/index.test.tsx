import React from "react";
import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";

import { useJavascriptEnabled } from "../../library/hooks/useJavascriptEnabled";
import Index from "../index";

jest.mock("../../library/hooks/useJavascriptEnabled");

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
