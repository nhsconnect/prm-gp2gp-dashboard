import React from "react";
import { getByRole, render } from "@testing-library/react";
import { Radios } from "../";

describe("Radios component", () => {
  it("displays the title", () => {
    const title = "This is a radio section";

    const { getByText } = render(
      <Radios
        title={title}
        options={[]}
        radioId="radio-id-1"
        selectedValue="option-1"
        setSelectedValue={() => {}}
      />
    );

    expect(getByText("This is a radio section")).toBeInTheDocument();
  });

  it("displays one option with unique optionId and unique radioId", () => {
    const options = [{ displayValue: "First option", value: "option-1" }];

    const { getByRole } = render(
      <Radios
        title=""
        options={options}
        radioId="radio-id-1"
        selectedValue="option-1"
        setSelectedValue={() => {}}
      />
    );

    const radioOption = getByRole("radio", { name: "First option" });

    expect(radioOption).toBeInTheDocument();
    expect(radioOption).toHaveAttribute("id", "radio-id-1-option-0");
    expect(radioOption).toHaveAttribute("name", "radio-input-radio-id-1");
  });

  it("displays multiple options", () => {
    const options = [
      { displayValue: "First option", value: "option-1" },
      { displayValue: "Second option", value: "option-2" },
      { displayValue: "Third option", value: "option-3" },
    ];

    const { getAllByRole } = render(
      <Radios
        title=""
        options={options}
        radioId="radio-id-1"
        selectedValue="option-1"
        setSelectedValue={() => {}}
      />
    );

    const radioOptions = getAllByRole("radio");

    expect(radioOptions.length).toBe(3);
    expect(radioOptions[0].nextSibling).toHaveTextContent("First option");
    expect(radioOptions[1].nextSibling).toHaveTextContent("Second option");
    expect(radioOptions[2].nextSibling).toHaveTextContent("Third option");
  });

  it("displays multiple options with default checked options", () => {
    const options = [
      { displayValue: "First option", value: "option-1" },
      { displayValue: "Second option", value: "option-2" },
      { displayValue: "Third option", value: "option-3" },
    ];
    const { getByRole } = render(
      <Radios
        title=""
        options={options}
        radioId="radio-id-1"
        selectedValue={"option-2"}
        setSelectedValue={() => {}}
      />
    );

    const firstOption = getByRole("radio", { name: "First option" });
    const secondOption = getByRole("radio", { name: "Second option" });

    expect(firstOption).not.toBeChecked();
    expect(secondOption).toBeChecked();
  });

  it("calls callback with default option value when button pressed", () => {
    const options = [
      { displayValue: "First option", value: "option-1" },
      { displayValue: "Second option", value: "option-2" },
    ];
    const callback = jest.fn();

    const { getByText } = render(
      <Radios
        title=""
        options={options}
        radioId="radio-id-1"
        selectedValue="option-1"
        setSelectedValue={callback}
      />
    );
    const selectedData = getByText("Second option");
    selectedData.click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("option-2");
  });
});
