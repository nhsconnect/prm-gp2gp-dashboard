import React from "react";
import { render } from "@testing-library/react";

import { AlphabeticalCcgList } from "../";

describe("AlphabeticalCcgList component", () => {
  const alphabetisedCcgs = new Map();
  alphabetisedCcgs.set("N", [
    { odsCode: "14A", name: "NINE CCG" },
    { odsCode: "17A", name: "NO CCG" },
    { odsCode: "6A", name: "NORTH CCG" },
  ]);

  it("displays ccgs under correct letter", () => {
    const { getByRole } = render(
      <AlphabeticalCcgList sortedCcgs={alphabetisedCcgs} />
    );

    const alphabetLetterHeading = getByRole("heading", {
      name: "N",
      level: 2,
    });

    const ccgListBeginningWithN = alphabetLetterHeading.nextSibling;
    const ccgsInList = ccgListBeginningWithN!.childNodes;

    expect(ccgsInList![0]).toHaveTextContent("Nine CCG - 14A");
    expect(ccgsInList![1]).toHaveTextContent("No CCG - 17A");
    expect(ccgsInList![2]).toHaveTextContent("North CCG - 6A");
  });

  it("has a link to a CCG page", () => {
    const { getByRole } = render(
      <AlphabeticalCcgList sortedCcgs={alphabetisedCcgs} />
    );

    const ccgPageLink = getByRole("link", {
      name: "North CCG - 6A",
    });

    expect(ccgPageLink.getAttribute("href")).toBe("/ccg/6A");
  });

  it("has a back to top link for each letter", () => {
    const alphabetisedCcgs2 = new Map();
    alphabetisedCcgs2.set("E", [{ odsCode: "13A", name: "EAST CCG" }]);
    alphabetisedCcgs2.set("N", [{ odsCode: "14A", name: "NORTH CCG" }]);
    alphabetisedCcgs2.set("W", [{ odsCode: "8A", name: "WEST CCG" }]);

    const { getAllByRole } = render(
      <AlphabeticalCcgList sortedCcgs={alphabetisedCcgs2} />
    );

    const ccgPageLinks = getAllByRole("link", {
      name: "Back to top",
    });

    expect(ccgPageLinks[0].getAttribute("href")).toBe("#nhsuk-nav-a-z");
    expect(ccgPageLinks).toHaveLength(3);
  });

  it("does not display letters where there are no CCGs for that letter", () => {
    const { queryByRole } = render(
      <AlphabeticalCcgList sortedCcgs={alphabetisedCcgs} />
    );

    const alphabetLetterHeadingWithoutCcgs = queryByRole("heading", {
      name: "A",
      level: 2,
    });
    expect(alphabetLetterHeadingWithoutCcgs).not.toBeInTheDocument();
  });

  it("has correct id to allow user to scroll to selected letter", () => {
    render(<AlphabeticalCcgList sortedCcgs={alphabetisedCcgs} />);

    const selectedLetter = document.getElementById("N");
    expect(selectedLetter).toBeInTheDocument();
  });
});
