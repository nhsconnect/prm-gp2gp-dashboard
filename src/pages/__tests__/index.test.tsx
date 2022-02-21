import React from "react";
import { render } from "@testing-library/react";
import Index from "../index";

jest.mock(
  "../../data/organisations/practiceMetrics.json",
  () => ({
    practices: [
      { odsCode: "A12345", name: "Test Practice", metrics: [] },
      { odsCode: "X99999", name: "Second Practice", metrics: [] },
    ],
    ccgs: [
      { odsCode: "12A", name: "Test CCG", practices: ["A12345"] },
      { odsCode: "13B", name: "Second CCG", practices: ["X99999"] },
    ],
  }),
  { virtual: true }
);

describe("Homepage", () => {
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
    const sectionText = getByText(
      /registrations to and from the armed forces or justice system/
    );

    expect(sectionHeading).toBeInTheDocument();
    expect(sectionText).toBeInTheDocument();
  });
});
