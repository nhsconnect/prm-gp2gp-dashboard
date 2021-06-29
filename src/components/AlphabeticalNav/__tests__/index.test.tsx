import React from "react";
import { render } from "@testing-library/react";

import { AlphabeticalNav } from "../";

describe("AlphabeticalNav component", () => {
  const alphabetisedItems = new Map();
  alphabetisedItems.set("N", [{ odsCode: "14A", name: "NORTH CCG" }]);

  it("displays all letters in the alphabet", () => {
    const { getAllByRole } = render(
      <AlphabeticalNav sortedItems={alphabetisedItems} />
    );

    const alphabetLetters = getAllByRole("listitem");

    expect(alphabetLetters).toHaveLength(26);
    expect(alphabetLetters[0]).toHaveTextContent("A");
    expect(alphabetLetters[1]).toHaveTextContent("B");
    expect(alphabetLetters[2]).toHaveTextContent("C");
  });

  it("navigates to selected letter", () => {
    const { getByRole } = render(
      <AlphabeticalNav sortedItems={alphabetisedItems} />
    );

    const alphabetLetterLink = getByRole("link", {
      name: "N",
    });
    expect(alphabetLetterLink.getAttribute("href")).toBe("#N");
  });

  it("does not have a link to the letter if there are no items beginning with that letter", () => {
    const { queryByRole } = render(
      <AlphabeticalNav sortedItems={alphabetisedItems} />
    );

    const alphabetLetterLink = queryByRole("link", {
      name: "A",
    });

    expect(alphabetLetterLink).not.toBeInTheDocument();
  });

  it("has correct id to allow user to scroll back to the nav", () => {
    render(<AlphabeticalNav sortedItems={alphabetisedItems} />);

    const nav = document.getElementById("nhsuk-nav-a-z");
    expect(nav).toBeInTheDocument();
  });
});
