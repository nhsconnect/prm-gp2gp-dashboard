import React from "react";
import { render } from "@testing-library/react";

import { Header } from "../";

jest.mock("../../../library/hooks/useFeatureToggle");

describe("Header component", () => {
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
