import React from "react";
import { render } from "@testing-library/react";
import Details from "../index";

describe("Details component", () => {
  const headers = ["fruit ", "colour ", "quantity "];

  it("displays details summary", () => {
    const summary = "This is a table";

    const { getByText } = render(<Details summary={summary} />);

    expect(getByText("This is a table")).toBeInTheDocument();
  });

  it("displays table headers", () => {
    const { getByRole } = render(<Details headers={headers} />);

    expect(getByRole("columnheader", { name: "fruit" })).toBeInTheDocument();
    expect(getByRole("columnheader", { name: "colour" })).toBeInTheDocument();
    expect(getByRole("columnheader", { name: "quantity" })).toBeInTheDocument();
  });

  it("displays rows in correct order", () => {
    const fruits = [
      ["banana ", "yellow ", 2],
      ["mango ", "orange ", 3],
      ["melon ", "yellow ", 1],
    ];

    const { getAllByRole } = render(
      <Details headers={headers} rows={fruits} />
    );

    const allRows = getAllByRole("row");

    expect(allRows[1]).toHaveTextContent(
      "fruit banana colour yellow quantity 2"
    );
    expect(allRows[2]).toHaveTextContent(
      "fruit mango colour orange quantity 3"
    );
    expect(allRows[3]).toHaveTextContent(
      "fruit melon colour yellow quantity 1"
    );
  });
});
