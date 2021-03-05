import React from "react";
import { render } from "@testing-library/react";
import { TableGroupHeading } from "..";

describe("TableGroupHeading component", () => {
  it("displays table heading", () => {
    const { getByText, getAllByRole } = render(
      <table>
        <thead>
          <TableGroupHeading columnGapNumber={3} groupHeading="Heading text" />
        </thead>
      </table>
    );

    const allColumnHeaders = getAllByRole("columnheader");

    expect(allColumnHeaders[0]).toBeEmptyDOMElement();
    expect(allColumnHeaders[1]).toHaveTextContent("Heading text");
  });
});
