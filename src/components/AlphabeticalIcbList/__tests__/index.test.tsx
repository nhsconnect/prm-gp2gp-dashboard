import React from "react";
import { render } from "@testing-library/react";

import { AlphabeticalICBList } from "../";

describe("AlphabeticalICBList component", () => {
  const alphabetisedICBs = new Map();
  alphabetisedICBs.set("N", [
    { odsCode: "14A", name: "NINE ICB - 14A" },
    { odsCode: "17A", name: "NO ICB - 17A" },
    { odsCode: "6A", name: "NORTH ICB - 6A" },
  ]);

  it("displays icbs under correct letter", () => {
    const { getByRole } = render(
      <AlphabeticalICBList sortedICBs={alphabetisedICBs} />
    );

    const alphabetLetterHeading = getByRole("heading", {
      name: "N",
      level: 2,
    });

    const icbListBeginningWithN = alphabetLetterHeading.nextSibling;
    const icbsInList = icbListBeginningWithN!.childNodes;

    expect(icbsInList![0]).toHaveTextContent("Nine ICB - 14A");
    expect(icbsInList![1]).toHaveTextContent("No ICB - 17A");
    expect(icbsInList![2]).toHaveTextContent("North ICB - 6A");
  });

  it("has a link to a ICB page", () => {
    const { getByRole } = render(
      <AlphabeticalICBList sortedICBs={alphabetisedICBs} />
    );

    const icbPageLink = getByRole("link", {
      name: "North ICB - 6A",
    });

    expect(icbPageLink.getAttribute("href")).toBe("/icb/6A/integration-times");
  });

  it("has a back to top link for each letter", () => {
    const alphabetisedICBs2 = new Map();
    alphabetisedICBs2.set("E", [{ odsCode: "13A", name: "EAST ICB - 13A" }]);
    alphabetisedICBs2.set("N", [{ odsCode: "14A", name: "NORTH ICB - 14A" }]);
    alphabetisedICBs2.set("W", [{ odsCode: "8A", name: "WEST ICB - 8A" }]);

    const { getAllByRole } = render(
      <AlphabeticalICBList sortedICBs={alphabetisedICBs2} />
    );

    const icbPageLinks = getAllByRole("link", {
      name: "Back to top",
    });

    expect(icbPageLinks[0].getAttribute("href")).toBe("#nhsuk-nav-a-z");
    expect(icbPageLinks).toHaveLength(3);
  });

  it("does not display letters where there are no ICBs for that letter", () => {
    const { queryByRole } = render(
      <AlphabeticalICBList sortedICBs={alphabetisedICBs} />
    );

    const alphabetLetterHeadingWithoutICBs = queryByRole("heading", {
      name: "A",
      level: 2,
    });
    expect(alphabetLetterHeadingWithoutICBs).not.toBeInTheDocument();
  });

  it("has correct id to allow user to scroll to selected letter", () => {
    render(<AlphabeticalICBList sortedICBs={alphabetisedICBs} />);

    const selectedLetter = document.getElementById("N");
    expect(selectedLetter).toBeInTheDocument();
  });
});
