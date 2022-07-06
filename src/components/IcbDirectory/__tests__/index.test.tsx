import React from "react";
import { render } from "@testing-library/react";
import * as Gatsby from "gatsby";

import { ICBDirectory } from "../";

describe("ICBDirectory component", () => {
  beforeAll(() => {
    const useStaticQuery = jest.spyOn(Gatsby, "useStaticQuery");
    useStaticQuery.mockImplementation(() => ({
      allFile: {
        edges: [
          {
            node: {
              childOrganisationsJson: {
                icbs: [
                  { odsCode: "1A", name: "WING ICB - 1A" },
                  { odsCode: "3A", name: "NHS WEST ICB - 3A" },
                  { odsCode: "15A", name: "SOUTH ICB - 15A" },
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
    const { getByRole } = render(<ICBDirectory headingPriority={1} />);

    const heading = getByRole("heading", {
      name: "ICB A to Z",
      level: 1,
    });

    expect(heading).toBeInTheDocument();
  });

  it("displays the navigation component for the page", () => {
    const { getByRole } = render(<ICBDirectory headingPriority={1} />);

    const navigation = getByRole("navigation");

    expect(navigation).toBeInTheDocument();
  });

  it("displays the nav letters and alphabetical ICB list in the correct order", () => {
    const { getAllByRole } = render(<ICBDirectory headingPriority={1} />);
    const allLinks = getAllByRole("link");
    expect(allLinks[0]).toHaveTextContent("S");
    expect(allLinks[1]).toHaveTextContent("W");
    expect(allLinks[2]).toHaveTextContent("South ICB - 15A");
    expect(allLinks[3]).toHaveTextContent("Back to top");
    expect(allLinks[4]).toHaveTextContent("NHS West ICB - 3A");
    expect(allLinks[5]).toHaveTextContent("Wing ICB - 1A");
  });
});
