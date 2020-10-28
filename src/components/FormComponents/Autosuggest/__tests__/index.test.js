import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Autosuggest from "../index";
import * as featureToggle from "../../../../library/hooks/useFeatureToggle";

describe("Autosuggest component", () => {
  const inputLabelText = "Enter value";

  it("updates input value with text that the user has inputted", () => {
    const mockSetInputValue = jest.fn();
    const { getByLabelText } = render(
      <Autosuggest
        inputLabelText={inputLabelText}
        getSuggestionListItemText={suggestion => suggestion.name}
        getFormattedSelectionText={value => value.name}
        search={{
          search: () => [],
        }}
        setInputTextValue={mockSetInputValue}
        newSearchToggle={true}
      />
    );
    const input = getByLabelText(inputLabelText);
    userEvent.type(input, "app");
    expect(mockSetInputValue).toHaveBeenCalledWith("a");
    expect(mockSetInputValue).toHaveBeenCalledWith("p");
    expect(mockSetInputValue).toHaveBeenCalledWith("p");
  });

  it("sets input value when selecting value from suggestion list", async () => {
    const mockSetInputValue = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Autosuggest
        inputLabelText={inputLabelText}
        getSuggestionListItemText={suggestion => suggestion.name}
        getFormattedSelectionText={suggestion => suggestion.name}
        setInputTextValue={mockSetInputValue}
        inputTextValue="a"
        search={{ search: jest.fn().mockReturnValue([{ name: "apple" }]) }}
        newSearchToggle={true}
      />
    );

    const input = getByLabelText(inputLabelText);
    userEvent.click(input);

    const suggestion = getByRole("option");
    userEvent.click(suggestion);

    expect(mockSetInputValue).toHaveBeenCalledWith("apple");
  });

  it("limits results when maxResults is set", async () => {
    const mockSetInputValue = jest.fn();
    const { getByLabelText, queryByText, getAllByRole } = render(
      <Autosuggest
        inputLabelText={inputLabelText}
        getSuggestionListItemText={suggestion => suggestion.name}
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
        newSearchToggle={true}
      />
    );

    const input = getByLabelText(inputLabelText);
    userEvent.click(input);

    const suggestion = queryByText("pear");
    const listItems = getAllByRole("option");

    expect(suggestion).not.toBeInTheDocument();

    expect(listItems.length).toBe(2);
  });

  describe("text substring highlighting", () => {
    it("applies text-match--highlighted class to substring of suggestion that matches input text", async () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, getByText } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          setInputTextValue={mockSetInputValue}
          inputTextValue="app"
          search={{
            search: jest.fn().mockReturnValue([{ name: "apple" }]),
          }}
          maxResults={2}
          newSearchToggle={true}
        />
      );

      const input = getByLabelText(inputLabelText);
      userEvent.click(input);
      const suggestionSubstring = getByText("app");
      expect(suggestionSubstring).toBeInTheDocument();
      expect(suggestionSubstring.className).toContain(
        "text-match--highlighted"
      );
    });

    it("applies text-match--highlighted class despite different casing", async () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, getByText } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          setInputTextValue={mockSetInputValue}
          inputTextValue="APP"
          search={{
            search: jest.fn().mockReturnValue([{ name: "apple" }]),
          }}
          maxResults={2}
          newSearchToggle={true}
        />
      );

      const input = getByLabelText(inputLabelText);
      userEvent.click(input);
      const suggestionSubstring = getByText("app");
      expect(suggestionSubstring).toBeInTheDocument();
      expect(suggestionSubstring.className).toContain(
        "text-match--highlighted"
      );
    });

    it("returns two text-match--highlighted spans that match text input with multiple words", async () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, getByText } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          setInputTextValue={mockSetInputValue}
          inputTextValue="ap le"
          search={{
            search: jest.fn().mockReturnValue([{ name: "apple" }]),
          }}
          maxResults={2}
          newSearchToggle={true}
        />
      );

      const input = getByLabelText(inputLabelText);
      userEvent.click(input);
      const suggestionSubstring = getByText("ap");
      expect(suggestionSubstring).toBeInTheDocument();
      expect(suggestionSubstring.className).toContain(
        "text-match--highlighted"
      );

      const suggestionSubstringSecond = getByText("le");
      expect(suggestionSubstringSecond).toBeInTheDocument();
      expect(suggestionSubstringSecond.className).toContain(
        "text-match--highlighted"
      );
    });
  });
});
