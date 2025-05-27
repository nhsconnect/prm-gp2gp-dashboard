import React from "react";
import { render } from "@testing-library/react";
import { SkipLink } from "../";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

describe("SkipLink component", () => {
  it("focuses on the heading when skip link is clicked", async () => {
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

    await waitFor(() => {
      expect(headingElement).toHaveFocus();
      expect(headingElement).toHaveAttribute("tabindex", "-1");
    });
  });

  it("focuses on the heading when skip link is tabbed and entered using keyboard", async () => {
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

    await waitFor(() => {
      expect(headingElement).toHaveFocus();
      expect(headingElement).toHaveAttribute("tabindex", "-1");
    });
  });

  it("doesnt set tab index anywhere if there is no heading", async () => {
    const { getByRole } = render(<SkipLink />);

    const skipLink = getByRole("link", { name: "Skip to main content" });
    userEvent.click(skipLink);

    await waitFor(() => {
      expect(
        getByRole("link", { name: "Skip to main content" })
      ).not.toHaveFocus();
    });
  });
});
