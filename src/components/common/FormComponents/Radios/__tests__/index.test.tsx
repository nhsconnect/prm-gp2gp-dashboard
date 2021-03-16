import React from "react";
import { render } from "@testing-library/react";
import Radios from "../index";
import userEvent from "@testing-library/user-event";

describe("Radios component", () => {
  it("displays the title", () => {
    const title = "This is a radio section";

    const { getByText } = render(
      <Radios
        title={title}
        options={[]}
        linkLabel=""
        redirectURL="#"
        callback={() => {}}
      />
    );

    expect(getByText("This is a radio section")).toBeInTheDocument();
  });

  it("displays one option", () => {
    const options = [{ displayValue: "First option", value: "" }];

    const { getByRole } = render(
      <Radios
        title=""
        options={options}
        linkLabel=""
        redirectURL="#"
        callback={() => {}}
      />
    );

    const radioOption = getByRole("radio", { name: "First option" });

    expect(radioOption).toBeInTheDocument();
  });

  it("displays multiple options", () => {
    const options = [
      { displayValue: "First option", value: "" },
      { displayValue: "Second option", value: "" },
      { displayValue: "Third option", value: "" },
    ];

    const { getAllByRole } = render(
      <Radios
        title=""
        options={options}
        linkLabel=""
        redirectURL="#"
        callback={() => {}}
      />
    );

    const radioOptions = getAllByRole("radio");

    expect(radioOptions.length).toBe(3);
    expect(radioOptions[0].nextSibling).toHaveTextContent("First option");
    expect(radioOptions[1].nextSibling).toHaveTextContent("Second option");
    expect(radioOptions[2].nextSibling).toHaveTextContent("Third option");
  });

  it("calls callback with default option value when button pressed", () => {
    const options = [{ displayValue: "First option", value: "on" }];
    const callback = jest.fn();

    const { getByRole } = render(
      <Radios
        title=""
        options={options}
        linkLabel="Submit setting"
        redirectURL="#"
        callback={callback}
        defaultValue={"on"}
      />
    );

    const submitSettingsLink = getByRole("link", { name: "Submit setting" });
    userEvent.click(submitSettingsLink);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("on");
  });

  it("calls callback with selected value when button pressed", async () => {
    const options = [
      { displayValue: "First option", value: "on" },
      { displayValue: "Second option", value: "off" },
    ];
    const callback = jest.fn();

    const { getByRole } = render(
      <Radios
        title=""
        options={options}
        linkLabel="Submit setting"
        redirectURL="#"
        callback={callback}
        defaultValue="on"
      />
    );

    const secondOption = getByRole("radio", { name: "Second option" });
    const submitSettingsLink = getByRole("link", { name: "Submit setting" });

    userEvent.click(secondOption);
    userEvent.click(submitSettingsLink);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("off");
  });

  it("navigates to redirect URL", () => {
    const title = "This is a radio section";

    const { getByRole } = render(
      <Radios
        title={title}
        options={[]}
        linkLabel="Submit setting"
        redirectURL="/test-page"
        callback={() => {}}
      />
    );

    const submitSettingsLink = getByRole("link", { name: "Submit setting" });

    expect(submitSettingsLink.getAttribute("href")).toBe("/test-page");
  });
});
