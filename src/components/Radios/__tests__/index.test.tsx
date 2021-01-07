import React from "react";
import { render } from "@testing-library/react";
import Radios from "../index";

describe("Radios component", () => {
  it("displays the title", () => {
    const title = "This is a radio section";

    const { getByText } = render(<Radios title={title} options={[]} />);

    expect(getByText("This is a radio section")).toBeInTheDocument();
  });

  it("displays one option", () => {
    const options = ["First option"];

    const { getByRole } = render(<Radios title="" options={options} />);

    const radioOption = getByRole("radio", { name: "First option" });

    expect(radioOption).toBeInTheDocument();
  });

  it("displays multiple options", () => {
    const options = ["First option", "Second option", "Third option"];

    const { getAllByRole } = render(<Radios title="" options={options} />);

    const radioOptions = getAllByRole("radio");

    expect(radioOptions.length).toBe(3);
    expect(radioOptions[0].nextSibling).toHaveTextContent("First option");
    expect(radioOptions[1].nextSibling).toHaveTextContent("Second option");
    expect(radioOptions[2].nextSibling).toHaveTextContent("Third option");
  });
});
