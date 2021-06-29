import React from "react";
import { render } from "@testing-library/react";

import { AlphabeticalCcgList } from "../";

describe("AlphabeticalCcgList component", () => {
  const alphabetisedCcgs = { N: [{ odsCode: "14A", name: "NORTH CCG" }] };

  it("displays a single ccg under correct letter", () => {
    const { getByRole } = render(
      <AlphabeticalCcgList sortedCcgs={alphabetisedCcgs} />
    );

    const alphabetLetterHeading = getByRole("heading", {
      name: "N",
      level: 2,
    });

    const ccgListBeginningWithN = alphabetLetterHeading.nextSibling;
    const firstCcgInList = ccgListBeginningWithN?.firstChild;

    expect(firstCcgInList).toHaveTextContent("North CCG - 14A");
  });

  it("navigates to a ccg page when a link is clicked", () => {
    const { getByRole } = render(
      <AlphabeticalCcgList sortedCcgs={alphabetisedCcgs} />
    );

    const ccgPageLink = getByRole("link", {
      name: "North CCG - 14A",
    });

    expect(ccgPageLink.getAttribute("href")).toBe("/ccg/14A");
  });

  it("has a back to top link for each letter", () => {
    const alphabetisedCcgs2 = {
      E: [{ odsCode: "13A", name: "EAST CCG" }],
      N: [{ odsCode: "14A", name: "NORTH CCG" }],
      W: [{ odsCode: "8A", name: "WEST CCG" }],
    };

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
