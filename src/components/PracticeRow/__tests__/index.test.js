import React from "react";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PracticeRow from "../index";

describe("PracticeRow component", () => {
  it("navigates to a practice page when a link is clicked", () => {
    const { getByRole } = render(
      <table>
        <tbody>
          <PracticeRow
            odsCode="A12345"
            name="A PRACTICE"
            metrics={{ within3Days: 5, within8Days: 1, beyond8Days: 0 }}
          />
        </tbody>
      </table>
    );

    const practicePageLink = getByRole("link", {
      name: "A Practice | A12345",
    });

    expect(practicePageLink.getAttribute("href")).toBe("/practice/A12345");
  });

  it("displays practice SLA metrics in correct order", () => {
    const { getAllByRole } = render(
      <table>
        <tbody>
          <PracticeRow
            odsCode="A12345"
            name="A PRACTICE"
            metrics={{ within3Days: 5, within8Days: 1, beyond8Days: 0 }}
          />
        </tbody>
      </table>
    );

    const allCells = getAllByRole("cell");

    expect(allCells[0]).toHaveTextContent("A Practice | A12345");
    expect(allCells[1]).toHaveTextContent("5");
    expect(allCells[2]).toHaveTextContent("1");
    expect(allCells[3]).toHaveTextContent("0");
  });
});
