import React from "react";
import { render } from "@testing-library/react";

import { RedirectNotice } from "../";

describe("RedirectNotice component", () => {
  it("displays redirect title", () => {
    const { getByRole } = render(
      <RedirectNotice redirectLink="" linkText="" />
    );

    const expectedHeading = getByRole("heading", {
      name: "This page has been moved.",
      level: 1,
    });
    expect(expectedHeading).toBeInTheDocument();
  });

  it("displays redirect text with href to redirectLink", () => {
    const redirectLink = "/redirect-link";
    const linkText = "A CCG - 11A";

    const { getByText, getByRole } = render(
      <RedirectNotice redirectLink={redirectLink} linkText={linkText} />
    );

    const expectedText = getByText(/Please go to/);
    expect(expectedText).toBeInTheDocument();

    const expectedRedirectLink = getByRole("link", {
      name: linkText,
    });
    expect(expectedRedirectLink.getAttribute("href")).toBe(redirectLink);
  });
});
