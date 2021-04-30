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
      />
    );

    const pomegranateOption = getByRole("option", {
      name: "Pomegranate",
    });

    expect(pomegranateOption).toHaveAttribute("selected");
  });

  it("selects value when clicked", () => {
    const { getByRole } = render(
      <Select
        label="Select fruit"
        options={fruitOptions}
        id="fruitSelect"
        defaultValue="pomegranate"
      />
    );

    const fruitSelect = getByRole("combobox", {
      name: "Select fruit",
    });
    const pomegranateOption = getByRole("option", {
      name: "Pomegranate",
    });

    userEvent.selectOptions(fruitSelect, "pomegranate");

    expect(pomegranateOption).toHaveAttribute("selected");
  });
});
