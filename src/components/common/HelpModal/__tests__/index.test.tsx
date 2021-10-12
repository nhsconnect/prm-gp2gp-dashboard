import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HelpModal } from "../";

jest.mock("no-scroll");

describe("HelpModal component", () => {
  it("displays content and close button when modal is open", async () => {
    const { queryByText, findByText, getByRole, findByRole, queryByRole } =
      render(
        <HelpModal
          ariaLabelledBy=""
          iconHiddenDescription=""
          content={<p>This is content</p>}
        />
      );

    expect(queryByText("This is content")).not.toBeInTheDocument();
    expect(queryByRole("button", { name: "Close" })).not.toBeInTheDocument();

    const openButton = getByRole("button");
    userEvent.click(openButton);

    expect(await findByText("This is content")).toBeInTheDocument();
    expect(await findByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});
