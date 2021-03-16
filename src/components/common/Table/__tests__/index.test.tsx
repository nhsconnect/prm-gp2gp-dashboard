import React from "react";
import { render } from "@testing-library/react";
import Table from "../index";

describe("Table component", () => {
  const headers = ["fruit ", "colour ", "quantity "];

  const rows = [
    ["banana ", "yellow ", "2"],
    ["mango ", "orange ", "3"],
    ["melon ", "yellow ", "1"],
  ];

  it("displays table headers in the correct order", () => {
    const { getAllByRole } = render(<Table headers={headers} rows={rows} />);

    const allHeaders = getAllByRole("columnheader");

    expect(allHeaders[0]).toHaveTextContent("fruit");
    expect(allHeaders[1]).toHaveTextContent("colour");
    expect(allHeaders[2]).toHaveTextContent("quantity");
    expect(allHeaders.length).toBe(3);
  });

  it("displays rows in correct order", () => {
    const { getAllByRole } = render(<Table headers={headers} rows={rows} />);

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
    expect(allRows.length).toBe(4);
  });

  it("displays table caption when passed in", () => {
    const { getByText, getByRole } = render(
      <Table headers={headers} captionText="Fruits Caption" rows={rows} />
    );

    const table = getByRole("table");

    expect(getByText("Fruits Caption")).toBeInTheDocument();
    expect(table.getAttribute("aria-describedby")).toBe("table-title");
  });
});
