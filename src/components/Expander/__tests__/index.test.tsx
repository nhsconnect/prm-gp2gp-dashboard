import { render, screen } from "@testing-library/react";
import React from "react";
import { Expander } from "../index";
import userEvent from "@testing-library/user-event";

describe("Expander", () => {
  it("displays title and content after clicking the title", () => {
    const { getByText } = render(
      <Expander title="This is title" content={"Some content"} />
    );

    const elementTitle = getByText("This is title");
    const byText = getByText("Some content");

    expect(elementTitle).toBeInTheDocument();
    expect(byText).not.toBeVisible();

    userEvent.click(elementTitle);
    expect(byText).toBeVisible();
  });
});
