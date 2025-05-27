import { render } from "@testing-library/react";
import React from "react";
import { Expander } from "../";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

describe("Expander", () => {
  it("displays title and content after clicking the title", async () => {
    const { getByText } = render(
      <Expander title="This is title" content={"Some content"} />
    );

    const elementTitle = getByText("This is title");
    const byText = getByText("Some content");

    expect(elementTitle).toBeInTheDocument();
    expect(byText).not.toBeVisible();

    userEvent.click(elementTitle);

    await waitFor(() => {
      expect(byText).toBeVisible();
    });
  });
});
