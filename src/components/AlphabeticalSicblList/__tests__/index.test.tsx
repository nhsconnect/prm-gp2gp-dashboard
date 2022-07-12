import React from "react";
import { render } from "@testing-library/react";

import { AlphabeticalSICBLList } from "../";

describe("AlphabeticalSICBLList component", () => {
  const alphabetisedSICBLs = new Map();
  alphabetisedSICBLs.set("N", [
    { odsCode: "14A", name: "NINE ICB - 14A" },
    { odsCode: "17A", name: "NO ICB - 17A" },
    { odsCode: "6A", name: "NORTH ICB - 6A" },
  ]);

  it("displays sicbls under correct letter", () => {
    const { getByRole } = render(
      <AlphabeticalSICBLList sortedSICBLs={alphabetisedSICBLs} />
    );

    const alphabetLetterHeading = getByRole("heading", {
      name: "N",
      level: 2,
    });

    const sicblListBeginningWithN = alphabetLetterHeading.nextSibling;
    const sicblsInList = sicblListBeginningWithN!.childNodes;

    expect(sicblsInList![0]).toHaveTextContent("Nine ICB - 14A");
    expect(sicblsInList![1]).toHaveTextContent("No ICB - 17A");
    expect(sicblsInList![2]).toHaveTextContent("North ICB - 6A");
  });

  it("has a link to a SICBL page", () => {
    const { getByRole } = render(
      <AlphabeticalSICBLList sortedSICBLs={alphabetisedSICBLs} />
    );

    const sicblPageLink = getByRole("link", {
      name: "North ICB - 6A",
    });

    expect(sicblPageLink.getAttribute("href")).toBe(
      "/sub-ICB-location/6A/integration-times"
    );
  });

  it("has a back to top link for each letter", () => {
    const alphabetisedSICBLs2 = new Map();
    alphabetisedSICBLs2.set("E", [{ odsCode: "13A", name: "EAST ICB - 13A" }]);
    alphabetisedSICBLs2.set("N", [{ odsCode: "14A", name: "NORTH ICB - 14A" }]);
    alphabetisedSICBLs2.set("W", [{ odsCode: "8A", name: "WEST ICB - 8A" }]);

    const { getAllByRole } = render(
      <AlphabeticalSICBLList sortedSICBLs={alphabetisedSICBLs2} />
    );

    const sicblPageLinks = getAllByRole("link", {
      name: "Back to top",
    });

    expect(sicblPageLinks[0].getAttribute("href")).toBe("#nhsuk-nav-a-z");
    expect(sicblPageLinks).toHaveLength(3);
  });

  it("does not display letters where there are no SubICBLocations for that letter", () => {
    const { queryByRole } = render(
      <AlphabeticalSICBLList sortedSICBLs={alphabetisedSICBLs} />
    );

    const alphabetLetterHeadingWithoutSICBLs = queryByRole("heading", {
      name: "A",
      level: 2,
    });
    expect(alphabetLetterHeadingWithoutSICBLs).not.toBeInTheDocument();
  });

  it("has correct id to allow user to scroll to selected letter", () => {
    render(<AlphabeticalSICBLList sortedSICBLs={alphabetisedSICBLs} />);

    const selectedLetter = document.getElementById("N");
    expect(selectedLetter).toBeInTheDocument();
  });
});
