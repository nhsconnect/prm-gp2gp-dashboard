import React from "react";
import { render } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";
import { Table } from "../";
import { useFeatureToggles } from "../../../../library/hooks/useFeatureToggle";

jest.mock("../../../../library/hooks/useFeatureToggle");

describe("Table component", () => {
  beforeEach(() => {
    when(mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showHistoricalData: true });
  });

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

  it("displays table body rows correctly", () => {
    const { getAllByRole } = render(<Table headers={headers} rows={rows} />);

    const allRowHeaders = getAllByRole("rowheader");
    const allNonHeaderCells = getAllByRole("cell");

    expect(allRowHeaders[0]).toHaveTextContent("banana");
    expect(allRowHeaders[1]).toHaveTextContent("mango");
    expect(allRowHeaders[2]).toHaveTextContent("melon");
    expect(allRowHeaders.length).toBe(3);

    expect(allNonHeaderCells[0]).toHaveTextContent("yellow");
    expect(allNonHeaderCells[1]).toHaveTextContent("2");
    expect(allNonHeaderCells[2]).toHaveTextContent("orange");
    expect(allNonHeaderCells[3]).toHaveTextContent("3");
    expect(allNonHeaderCells[4]).toHaveTextContent("yellow");
    expect(allNonHeaderCells[5]).toHaveTextContent("1");

    expect(allNonHeaderCells.length).toBe(6);
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
      <Table
        headers={headers}
        caption={{ text: "Fruits Caption", hidden: false }}
        rows={rows}
      />
    );

    const table = getByRole("table");

    expect(getByText("Fruits Caption")).toBeInTheDocument();
    expect(table.getAttribute("aria-describedby")).toBe("table-title");
  });
});
