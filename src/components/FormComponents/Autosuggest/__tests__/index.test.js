import React from "react";
import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import Autosuggest from "../index";
import * as featureToggle from "../../../../library/hooks/useFeatureToggle";
import { queryAllByRole } from "@testing-library/dom";

describe("Autosuggest component", () => {
  const inputLabelText = "Enter value";

  it("updates input value with text that the user has inputted", () => {
    featureToggle.useFeatureToggle = jest.fn().mockReturnValue(true);
    const mockSetInputValue = jest.fn();
    const { getByLabelText } = render(
      <Autosuggest
        inputLabelText={inputLabelText}
        renderSuggestion={suggestion => <div>{suggestion.name}</div>}
        getFormattedSelectionText={value => value.name}
        search={{
          search: () => [],
        }}
        setInputTextValue={mockSetInputValue}
      />
    );
    const input = getByLabelText(inputLabelText);
    userEvent.type(input, "app");
    expect(mockSetInputValue).toHaveBeenCalledWith("a");
    expect(mockSetInputValue).toHaveBeenCalledWith("p");
    expect(mockSetInputValue).toHaveBeenCalledWith("p");
  });

  it("sets input value when selecting value from suggestion list", async () => {
    featureToggle.useFeatureToggle = jest.fn().mockReturnValue(true);
    const mockSetInputValue = jest.fn();
    const { getByLabelText, getByText } = render(
      <Autosuggest
        inputLabelText={inputLabelText}
        renderSuggestion={suggestion => <div>{suggestion.name}</div>}
        getFormattedSelectionText={suggestion => suggestion.name}
        setInputTextValue={mockSetInputValue}
        inputTextValue="a"
        search={{ search: jest.fn().mockReturnValue([{ name: "apple" }]) }}
      />
    );

    const input = getByLabelText(inputLabelText);
    userEvent.click(input);

    const suggestion = getByText("apple");
    userEvent.click(suggestion);

    expect(mockSetInputValue).toHaveBeenCalledWith("apple");
  });

  it("limits results when maxResults is set", async () => {
    featureToggle.useFeatureToggle = jest.fn().mockReturnValue(true);
    const mockSetInputValue = jest.fn();
    const { getByLabelText, queryByText, getAllByRole } = render(
      <Autosuggest
        inputLabelText={inputLabelText}
        renderSuggestion={suggestion => <div>{suggestion.name}</div>}
        getFormattedSelectionText={suggestion => suggestion.name}
        setInputTextValue={mockSetInputValue}
        inputTextValue="a"
        search={{
          search: jest
            .fn()
            .mockReturnValue([
              { name: "apple" },
              { name: "banana" },
              { name: "pear" },
            ]),
        }}
        maxResults={2}
      />
    );

    const input = getByLabelText(inputLabelText);
    userEvent.click(input);

    const suggestion = queryByText("pear");
    const listItems = getAllByRole("option");

    expect(suggestion).not.toBeInTheDocument();

    expect(listItems.length).toBe(2);
  });
});
