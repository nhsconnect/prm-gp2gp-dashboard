import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../";

describe("Select component", () => {
  const fruitOptions = [
    { displayText: "Mango", value: "mango" },
    { displayText: "Blueberry", value: "blueberry" },
    { displayText: "Pomegranate", value: "pomegranate" },
  ];

  it("sets default value", () => {
    const { getByRole } = render(
      <Select
        label="Select fruit"
        options={fruitOptions}
        id="fruitSelect"
        defaultValue="pomegranate"
        handleValueChange={() => {}}
      />
    );

    const fruitSelect = getByRole("combobox", {
      name: "Select fruit",
    });

    expect(fruitSelect).toHaveValue("pomegranate");
  });

  it("selects value when clicked", () => {
    const { getByRole } = render(
      <Select
        label="Select fruit"
        options={fruitOptions}
        id="fruitSelect"
        defaultValue="pomegranate"
        handleValueChange={() => {}}
      />
    );

    const fruitSelect = getByRole("combobox", {
      name: "Select fruit",
    });

    userEvent.selectOptions(fruitSelect, "blueberry");

    expect(fruitSelect).toHaveValue("blueberry");
  });
});
