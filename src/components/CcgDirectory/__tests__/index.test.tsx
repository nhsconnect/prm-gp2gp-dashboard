import React from "react";
import { render } from "@testing-library/react";
import * as Gatsby from "gatsby";

import { CcgDirectory } from "../";

describe("CcgDirectory component", () => {
  beforeAll(() => {
    const useStaticQuery = jest.spyOn(Gatsby, "useStaticQuery");
    useStaticQuery.mockImplementation(() => ({
      allFile: {
        edges: [
          {
            node: {
              childOrganisationsJson: {
                ccgs: [
                  { odsCode: "1A", name: "WING CCG" },
                  { odsCode: "3A", name: "NHS WEST CCG" },
                  { odsCode: "15A", name: "SOUTH CCG" },
                ],
              },
            },
          },
        ],
      },
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

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
