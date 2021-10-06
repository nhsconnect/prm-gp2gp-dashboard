import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "../";

describe("Modal component", () => {
  it("adds title as aria label and displays content when button is clicked", () => {
    const {
      queryByText,
      getByText,
      getByRole,
      queryByLabelText,
      getByLabelText,
    } = render(<Modal titleText="This is title" content="This is content" />);

    expect(queryByLabelText("This is title")).not.toBeInTheDocument();
    expect(queryByText("This is content")).not.toBeInTheDocument();

    const openButton = getByRole("button");
    userEvent.click(openButton);

    expect(getByLabelText("This is title")).toBeInTheDocument();
    expect(getByText("This is content")).toBeInTheDocument();
  });

  it("closes modal when button is clicked", () => {
    const { queryByText, getByText, getByRole } = render(
      <Modal titleText="This is title" content="This is content" />
    );

    const openButton = getByRole("button");
    userEvent.click(openButton);

    expect(getByText("This is content")).toBeInTheDocument();

    const closeButton = getByRole("button", { name: "Close" });
    userEvent.click(closeButton);

    expect(queryByText("This is content")).not.toBeInTheDocument();
  });
});
