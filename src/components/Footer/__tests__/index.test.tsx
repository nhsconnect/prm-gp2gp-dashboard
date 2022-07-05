import React from "react";
import { render } from "@testing-library/react";

import { Footer } from "../";

describe("Footer component", () => {
  it("displays ICB A to Z link in footer", () => {
    const { getByRole } = render(<Footer />);

    const icbAtoZLink = getByRole("link", {
      name: "ICB A to Z",
    });
    expect(icbAtoZLink).toBeInTheDocument();
    expect(icbAtoZLink.getAttribute("href")).toBe("/icbs");
  });

  it("displays Definitions and notes about this data link in footer", () => {
    const { getByRole } = render(<Footer />);

    const definitionAndNotesLink = getByRole("link", {
      name: "Definitions and notes about this data",
    });
    expect(definitionAndNotesLink).toBeInTheDocument();
    expect(definitionAndNotesLink.getAttribute("href")).toBe(
      "/definitions-and-notes-about-this-data"
    );
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
