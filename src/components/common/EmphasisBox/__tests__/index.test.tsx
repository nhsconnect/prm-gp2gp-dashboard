import React from "react";
import { render } from "@testing-library/react";
import { EmphasisBox } from "../";

describe("EmphasisBox component", () => {
  it("displays children", () => {
    const { getByRole } = render(
      <EmphasisBox>
        <a href="/test">link</a>
      </EmphasisBox>
    );

    const link = getByRole("link", {
      name: "link",
    });

    expect(link.getAttribute("href")).toBe("/test");
  });

  it("displays title when passed", () => {
    const { getByRole } = render(<EmphasisBox title="This is title" />);

    expect(
      getByRole("heading", {
        level: 3,
        name: "This is title",
      })
    ).toBeInTheDocument();
  });
});
