import React from "react";
import { render } from "@testing-library/react";

import { Footer } from "../";

describe("Footer component", () => {
  it("displays Ccg A to Z link in footer", () => {
    const { getByRole } = render(<Footer />);

    const ccgAtoZLink = getByRole("link", {
      name: "CCG A to Z",
    });
    expect(ccgAtoZLink).toBeInTheDocument();
    expect(ccgAtoZLink.getAttribute("href")).toBe("/ccgs");
  });

  it("displays Contact us link in footer", () => {
    const { getByRole } = render(<Footer />);

    const contactUsLink = getByRole("link", {
      name: "Contact us",
    });
    expect(contactUsLink).toBeInTheDocument();
    expect(contactUsLink.getAttribute("href")).toBe("/contact-us");
  });
});
