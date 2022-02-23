import { render } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { RadioButtonsForm } from "../index";

describe("RadioButtonsForm", () => {
  it("renders form and calls onSubmit when submit button is clicked", () => {
    const handleSubmitButton = jest
      .fn()
      .mockImplementation((e) => e.preventDefault());
    const submitText = "submitText";

    const { getByRole } = render(
      <RadioButtonsForm
        submitText={submitText}
        handleSubmit={handleSubmitButton}
      />
    );

    const submitButton = getByRole("button", { name: submitText });
    userEvent.click(submitButton);

    expect(handleSubmitButton).toBeCalledTimes(1);
  });
});
