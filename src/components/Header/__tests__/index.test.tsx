import React from "react";
import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";

import { Header } from "../";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";

jest.mock("../../../library/hooks/useFeatureToggle");

describe("Header component", () => {
  beforeEach(() => {
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showPublicBetaText: true });
  });

  it("displays Public Beta", () => {
    const { getByText } = render(<Header />);

    const phaseBannerTag = getByText("Public Beta");
    expect(phaseBannerTag).toBeInTheDocument();
  });

  it("displays site service name", () => {
    const { getByText } = render(<Header />);

    const siteServiceName = getByText("GP Registrations Data");
    expect(siteServiceName).toBeInTheDocument();
  });
});

describe("showPublicBetaText toggled off", () => {
  it("displays Private Beta", () => {
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showPublicBetaText: false });

    const { getByText } = render(<Header />);

    const phaseBannerTag = getByText("Private Beta");
    expect(phaseBannerTag).toBeInTheDocument();
  });
});
