import React from "react";
import { render } from "@testing-library/react";
import * as Gatsby from "gatsby";
import Index from "../index";

describe("Homepage", () => {
  beforeAll(() => {
    const useStaticQuery = jest.spyOn(Gatsby, "useStaticQuery");
    useStaticQuery.mockImplementation(() => ({
      allFile: {
        edges: [
          {
            node: {
              childOrganisationsJson: {
                practices: [
                  { odsCode: "A12345", name: "Test Practice" },
                  { odsCode: "X99999", name: "Second Practice" },
                ],
                ccgs: [
                  { odsCode: "12A", name: "Test CCG" },
                  { odsCode: "13B", name: "Second CCG" },
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

  it("displays organisational search", () => {
    const { getByRole } = render(<Index />);

    const organisationSearchHeading = getByRole("heading", {
      name: "Search",
      level: 2,
    });

    expect(organisationSearchHeading).toBeInTheDocument();
  });

  it("displays About section", () => {
    const { getByRole, getByText } = render(<Index />);

    const sectionHeading = getByRole("heading", {
      name: "About",
      level: 2,
    });
    const sectionText = getByText(
      /This site provides monthly data about GP2GP transfers/
    );

    expect(sectionHeading).toBeInTheDocument();
    expect(sectionText).toBeInTheDocument();
  });

  it("displays What you can find out section", () => {
    const { getByRole, getByText } = render(<Index />);

    const sectionHeading = getByRole("heading", {
      name: "What you can find out",
      level: 2,
    });
    const sectionText = getByText(
      /percentage of transfers that failed for technical reasons/
    );

    expect(sectionHeading).toBeInTheDocument();
    expect(sectionText).toBeInTheDocument();
  });

  it("displays What this data can’t tell you section", () => {
    const { getByRole, getByText } = render(<Index />);

    const sectionHeading = getByRole("heading", {
      name: "What this data can’t tell you",
      level: 2,
    });
    const sectionText = getByText(/registrations to and from the armed forces/);

    expect(sectionHeading).toBeInTheDocument();
    expect(sectionText).toBeInTheDocument();
  });
});
