import React from "react";
import { render } from "@testing-library/react";
import { SkipLink } from "../";
import userEvent from "@testing-library/user-event";

describe("SkipLink component", () => {
  it("focuses on the heading when skip link is clicked", () => {
    const { getByRole } = render(
      <>
        <SkipLink />
        <h1>This is a heading</h1>
      </>
    );

    const skipLink = getByRole("link", { name: "Skip to main content" });
    const headingElement = getByRole("heading", {
      level: 1,
      name: "This is a heading",
    });

    expect(headingElement).not.toHaveFocus();
    expect(headingElement).not.toHaveAttribute("tabindex");

    userEvent.click(skipLink);
    expect(headingElement).toHaveFocus();
    expect(headingElement).toHaveAttribute("tabindex", "-1");
  });

  it("focuses on the heading when skip link is tabbed and entered using keyboard", () => {
    const { getByRole } = render(
      <>
        <SkipLink />
        <h1>This is a heading</h1>
      </>
    );

    const skipLink = getByRole("link", { name: "Skip to main content" });
    const headingElement = getByRole("heading", {
      level: 1,
      name: "This is a heading",
    });

    expect(headingElement).not.toHaveFocus();
    expect(headingElement).not.toHaveAttribute("tabindex");

    userEvent.tab();
    userEvent.type(skipLink, "{enter}");
    expect(headingElement).toHaveFocus();
    expect(headingElement).toHaveAttribute("tabindex", "-1");
  });

  it("doesnt set tab index anywhere if there is no heading", () => {
    const { getByRole } = render(<SkipLink />);

    const skipLink = getByRole("link", { name: "Skip to main content" });
    userEvent.click(skipLink);

    expect(
      getByRole("link", { name: "Skip to main content" })
    ).not.toHaveFocus();
  });
});
