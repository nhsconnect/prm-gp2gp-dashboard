import React from "react";
import { render } from "@testing-library/react";

import { CcgDirectory } from "../";

describe("CcgDirectory component", () => {
  it("displays a single ccg under correct letter", () => {
    const ccgList = [
      { odsCode: "14A", name: "NORTH CCG", practices: ["A123"] },
    ];

    const { getByRole } = render(<CcgDirectory ccgs={ccgList} />);

    const alphabetLetterHeading = getByRole("heading", {
      name: "N",
      level: 2,
    });

    const ccgListBeginningWithN = alphabetLetterHeading.nextSibling;
    const firstCcgInList = ccgListBeginningWithN?.firstChild;

    expect(firstCcgInList).toHaveTextContent("North CCG - 14A");
  });

  it("navigates to a ccg page when a link is clicked", () => {
    const ccgList = [
      { odsCode: "14A", name: "NORTH CCG", practices: ["A123"] },
    ];

    const { getByRole } = render(<CcgDirectory ccgs={ccgList} />);

    const ccgPageLink = getByRole("link", {
      name: "North CCG - 14A",
    });

    expect(ccgPageLink.getAttribute("href")).toBe("/ccg/14A");
  });
});
