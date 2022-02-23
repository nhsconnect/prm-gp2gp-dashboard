import { fireEvent, render } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import { RadioButtonsForm } from "../index";

describe("RadioButtonsForm", () => {
  it("renders form and calls handleSubmit when submit button is clicked", () => {
    const onSubmitMock = jest.fn();
    const submitText = "submitText";

    const { getByRole } = render(
      <RadioButtonsForm submitText={submitText} onSubmit={onSubmitMock} />
    );

    const submitButton = getByRole("button", { name: submitText });
    userEvent.click(submitButton);

    expect(onSubmitMock).toBeCalledTimes(1);
  });

  it("submits form with default value of a radio button", () => {
    const onSubmitMock = jest.fn();
    const submitText = "submitText";

    const { getByTestId } = render(
      <RadioButtonsForm submitText={submitText} onSubmit={onSubmitMock} />
    );

    fireEvent.submit(getByTestId("nhsuk-radio-buttons-form"));

    expect(onSubmitMock).toBeCalledTimes(1);
    expect(onSubmitMock).toBeCalledWith({
      "radio-input-1": "Transfers requested",
    });
  });

  it("submits form with selected value of a radio button", () => {
    const onSubmitMock = jest.fn();
    const submitText = "submitText";

    const { getByTestId, getByDisplayValue } = render(
      <RadioButtonsForm submitText={submitText} onSubmit={onSubmitMock} />
    );

    const selectOption = getByDisplayValue("Integration times");
    selectOption.click();
    fireEvent.submit(getByTestId("nhsuk-radio-buttons-form"));

    expect(onSubmitMock).toBeCalledTimes(1);
    expect(onSubmitMock).toBeCalledWith({
      "radio-input-1": "Integration times",
    });
  });
});
