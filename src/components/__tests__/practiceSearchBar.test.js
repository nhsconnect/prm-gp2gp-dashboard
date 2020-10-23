import React from "react";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PracticeSearchBar from "../PracticeSearchBar/index";
import * as featureToggle from "../../library/hooks/useFeatureToggle";

describe("PracticeSearchBar component", () => {
  const inputLabelText = "Enter value";

  it("updates input value with text that the user has inputted", () => {
    featureToggle.useFeatureToggle = jest.fn().mockReturnValue(true);
    const mockSetInputValue = jest.fn();
    const { getByLabelText } = render(
      <PracticeSearchBar
        inputLabelText={inputLabelText}
        renderSuggestion={suggestion => <div>{suggestion.name}</div>}
        getSuggestionValue={value => value.name}
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
      <PracticeSearchBar
        inputLabelText={inputLabelText}
        renderSuggestion={suggestion => <div>{suggestion.name}</div>}
        getSuggestionValue={suggestion => suggestion.name}
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

  it("runs the onAutosuggestInputChange callback if it has been passed in", async () => {
    featureToggle.useFeatureToggle = jest.fn().mockReturnValue(true);
    const mockSetInputValue = jest.fn();
    const mockOnAutosuggestInputChange = jest.fn();
    const { getByLabelText, getByText } = render(
      <PracticeSearchBar
        inputLabelText={inputLabelText}
        renderSuggestion={suggestion => <div>{suggestion.name}</div>}
        getSuggestionValue={suggestion => suggestion.name}
        setInputTextValue={mockSetInputValue}
        onAutosuggestInputChange={mockOnAutosuggestInputChange}
        search={{ search: jest.fn().mockReturnValue([{ name: "apple" }]) }}
      />
    );

    const input = getByLabelText(inputLabelText);
    userEvent.type(input, "a");

    expect(mockOnAutosuggestInputChange).toHaveBeenCalledWith("a");
  });
});
