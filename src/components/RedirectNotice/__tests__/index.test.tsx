import React from "react";
import { render } from "@testing-library/react";

import { RedirectNotice } from "../";

describe("RedirectNotice component", () => {
  it("displays redirect title", () => {
    const { getByRole } = render(<RedirectNotice redirectLink="" />);

    const expectedHeading = getByRole("heading", {
      name: "This page has been moved.",
      level: 1,
    });
    expect(expectedHeading).toBeInTheDocument();
  });

  it("displays redirect text with href to redirectLink", () => {
    const redirectLink = "/redirect-link";
    const { getByText, getByRole } = render(
      <RedirectNotice redirectLink={redirectLink} />
    );

    const expectedText = getByText("To access, go to this");
    expect(expectedText).toBeInTheDocument();

    const expectedRedirectLink = getByRole("link", {
      name: "link",
    });
    expect(expectedRedirectLink.getAttribute("href")).toBe(redirectLink);
  });
});
