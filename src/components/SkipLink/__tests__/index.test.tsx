import React from "react";
import { render } from "@testing-library/react";
import { SkipLink } from "../";
import userEvent from "@testing-library/user-event";

describe("SkipLink component", () => {
  it("focuses on the heading when skip link is clicked", () => {
    const { getByRole, getByText } = render(
      <div>
        <SkipLink />
        <h1>This is a heading</h1>
      </div>
    );

    const skipLink = getByRole("link", { name: "Skip to main content" });
    expect(getByText("This is a heading")).not.toHaveFocus();
    expect(getByText("This is a heading")).not.toHaveAttribute("tabindex");

    userEvent.click(skipLink);
    expect(getByText("This is a heading")).toHaveFocus();
    expect(getByText("This is a heading")).toHaveAttribute("tabindex", "-1");
  });

  it("focuses on the heading when skip link is tabbed and entered using keyboard", () => {
    const { getByRole, getByText } = render(
      <div>
        <SkipLink />
        <h1>This is a heading</h1>
      </div>
    );

    const skipLink = getByRole("link", { name: "Skip to main content" });
    expect(getByText("This is a heading")).not.toHaveFocus();
    expect(getByText("This is a heading")).not.toHaveAttribute("tabindex");

    userEvent.tab();
    userEvent.type(skipLink, "enter");
    expect(getByText("This is a heading")).toHaveFocus();
    expect(getByText("This is a heading")).toHaveAttribute("tabindex", "-1");
  });

  it("doesnt set tab index anywhere if there is no heading", () => {
    const { getByRole } = render(
      <div>
        <SkipLink />
      </div>
    );

    const skipLink = getByRole("link", { name: "Skip to main content" });
    userEvent.click(skipLink);

    expect(
      getByRole("link", { name: "Skip to main content" })
    ).not.toHaveFocus();
  });
});
