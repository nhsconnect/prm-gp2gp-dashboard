import React from "react";
import { render } from "@testing-library/react";
import { Details } from "../";

describe("Details component", () => {
  it("displays details summary", () => {
    const summary = "This is a table";

    const { getByText } = render(
      <Details summary={summary} headers={[]} rows={[]} />
    );

    expect(getByText("This is a table")).toBeInTheDocument();
  });
});
