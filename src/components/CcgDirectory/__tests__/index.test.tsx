import React from "react";
import { render } from "@testing-library/react";

import { CcgDirectory } from "../";

describe("CcgDirectory component", () => {
  const ccgList = [
    { odsCode: "1A", name: "WING CCG", practices: ["A1156"] },
    { odsCode: "3A", name: "NHS WEST CCG", practices: ["A1278"] },
    { odsCode: "15A", name: "SOUTH CCG", practices: ["A1299"] },
  ];

  it("displays the relevant heading for the page", () => {
    const { getByRole } = render(<CcgDirectory ccgs={ccgList} />);

    const heading = getByRole("heading", {
      name: "CCG A to Z",
      level: 1,
    });

    expect(heading).toBeInTheDocument();
  });

  it("displays the navigation component for the page", () => {
    const { getByRole } = render(<CcgDirectory ccgs={ccgList} />);

    const navigation = getByRole("navigation");

    expect(navigation).toBeInTheDocument();
  });
});
