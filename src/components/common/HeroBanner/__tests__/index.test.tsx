import React from "react";
import { render } from "@testing-library/react";
import HeroBanner from "../index";

describe("HeroBanner component", () => {
  it("displays title and subtitle", () => {
    const { getByText } = render(
      <HeroBanner title="This is title" subtitle="This is a subtitle" />
    );
    expect(getByText("This is title")).toBeInTheDocument();
    expect(getByText("This is a subtitle")).toBeInTheDocument();
  });
});
