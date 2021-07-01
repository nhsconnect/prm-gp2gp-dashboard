import React from "react";
import { render } from "@testing-library/react";

import { CcgDirectory } from "../";

jest.mock(
  "../../../data/organisations/practiceMetrics.json",
  () => ({
    practices: [],
    ccgs: [
      { odsCode: "1A", name: "WING CCG", practices: ["A1156"] },
      { odsCode: "3A", name: "NHS WEST CCG", practices: ["A1278"] },
      { odsCode: "15A", name: "SOUTH CCG", practices: ["A1299"] },
    ],
  }),
  { virtual: true }
);

describe("CcgDirectory component", () => {
  it("displays the relevant heading with correct priority for the page", () => {
    const { getByRole } = render(<CcgDirectory headingPriority={1} />);

    const heading = getByRole("heading", {
      name: "CCG A to Z",
      level: 1,
    });

    expect(heading).toBeInTheDocument();
  });

  it("displays the navigation component for the page", () => {
    const { getByRole } = render(<CcgDirectory headingPriority={1} />);

    const navigation = getByRole("navigation");

    expect(navigation).toBeInTheDocument();
  });

  it("displays the nav letters and alphabetical CCG list in the correct order", () => {
    const { getAllByRole } = render(<CcgDirectory headingPriority={1} />);
    const allLinks = getAllByRole("link");
    expect(allLinks[0]).toHaveTextContent("S");
    expect(allLinks[1]).toHaveTextContent("W");
    expect(allLinks[2]).toHaveTextContent("South CCG - 15A");
    expect(allLinks[3]).toHaveTextContent("Back to top");
    expect(allLinks[4]).toHaveTextContent("NHS West CCG - 3A");
    expect(allLinks[5]).toHaveTextContent("Wing CCG - 1A");
  });
});
