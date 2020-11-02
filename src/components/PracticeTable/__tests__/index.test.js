import React from "react";
import { render } from "@testing-library/react";
import PracticeTable from "../index";

describe("PracticeTable component", () => {
  it("displays multiple valid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];
    const validPractices = [
      { odsCode: "A12345", name: "GP Practice" },
      { odsCode: "B12345", name: "GP Practice 2" },
    ];

    const { getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(getByText("GP Practice 2 | B12345")).toBeInTheDocument();
  });

  it("filters out invalid practices", () => {
    const ccgPractices = [
      { OrgId: "A12345", Name: "GP Practice" },
      { OrgId: "B12345", Name: "GP Practice 2" },
    ];
    const validPractices = [{ odsCode: "A12345", name: "GP Practice" }];

    const { queryByText, getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    expect(getByText("GP Practice | A12345")).toBeInTheDocument();
    expect(queryByText("GP Practice 2 | B12345")).not.toBeInTheDocument();
  });

  it("displays a message if there are no valid practices", () => {
    const ccgPractices = [{ OrgId: "B12345", Name: "GP Practice 2" }];
    const validPractices = [{ odsCode: "A12345", name: "GP Practice" }];

    const { getByText } = render(
      <PracticeTable
        ccgPractices={ccgPractices}
        validPractices={validPractices}
      />
    );

    expect(getByText("No practices found")).toBeInTheDocument();
  });
});
