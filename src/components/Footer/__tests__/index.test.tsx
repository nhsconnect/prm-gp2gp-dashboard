import React from "react";
import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";

import { Footer } from "../";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";

jest.mock("../../../library/hooks/useFeatureToggle");

describe("Footer component", () => {
  beforeEach(() => {
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showCcgAtoZLink: true });
  });

  it("displays Ccg A to Z link in footer", () => {
    const { getByRole } = render(<Footer />);

    const ccgAtoZLink = getByRole("link", {
      name: "CCG A to Z",
    });
    expect(ccgAtoZLink).toBeInTheDocument();
    expect(ccgAtoZLink.getAttribute("href")).toBe("/ccgs");
  });
});

describe("showCcgAtoZLink toggled off", () => {
  it("does not display Ccg A to Z link in footer", () => {
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showCcgAtoZLink: false });

    const { queryByRole } = render(<Footer />);

    const ccgAtoZLink = queryByRole("link", {
      name: "CCG A to Z",
    });
    expect(ccgAtoZLink).not.toBeInTheDocument();
  });
});
