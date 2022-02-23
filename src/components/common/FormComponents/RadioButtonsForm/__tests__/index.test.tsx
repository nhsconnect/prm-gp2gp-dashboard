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

  it("submits form with default values of radio buttons", () => {
    const onSubmitMock = jest.fn();
    const submitText = "submitText";

    const { getByTestId } = render(
      <RadioButtonsForm submitText={submitText} onSubmit={onSubmitMock} />
    );

    fireEvent.submit(getByTestId("nhsuk-radio-buttons-form"));

    expect(onSubmitMock).toBeCalledTimes(1);
    expect(onSubmitMock).toBeCalledWith({
      "radio-input-1": "Transfers requested",
      "radio-input-2": "Latest month",
    });
  });

  it("submits form with selected values of a radio button", () => {
    const onSubmitMock = jest.fn();
    const submitText = "submitText";

    const { getByTestId, getByDisplayValue } = render(
      <RadioButtonsForm submitText={submitText} onSubmit={onSubmitMock} />
    );

    const selectedData = getByDisplayValue("Integration times");
    const selectedTimeframe = getByDisplayValue("Last 6 months");
    selectedData.click();
    selectedTimeframe.click();
    fireEvent.submit(getByTestId("nhsuk-radio-buttons-form"));

    expect(onSubmitMock).toBeCalledTimes(1);
    expect(onSubmitMock).toBeCalledWith({
      "radio-input-1": "Integration times",
      "radio-input-2": "Last 6 months",
    });
  });
});
