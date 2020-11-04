import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Autosuggest from "../index";
import { Search } from "../../../../library/utils/search";

describe("Autosuggest component", () => {
  const inputLabelText = "Enter value";

  it("updates input value with text that the user has inputted", () => {
    const mockSetInputValue = jest.fn();
    const { getByLabelText } = render(
      <Autosuggest
        inputLabelText={inputLabelText}
        getSuggestionListItemText={suggestion => suggestion.name}
        getFormattedSelectionText={value => value.name}
        itemSearch={{
          search: () => [],
        }}
        onInputChange={mockSetInputValue}
      />
    );
    const input = getByLabelText(inputLabelText);
    userEvent.type(input, "app");
    expect(mockSetInputValue).toHaveBeenCalledWith(expect.anything(), {
      method: expect.anything(),
      newValue: "a",
    });
    expect(mockSetInputValue).toHaveBeenCalledWith(expect.anything(), {
      method: expect.anything(),
      newValue: "p",
    });
    expect(mockSetInputValue).toHaveBeenCalledWith(expect.anything(), {
      method: expect.anything(),
      newValue: "p",
    });
  });

  it("sets input value when selecting value from suggestion list", () => {
    const mockSetInputValue = jest.fn();
    const { getByLabelText, getByRole } = render(
      <Autosuggest
        inputLabelText={inputLabelText}
        getSuggestionListItemText={suggestion => suggestion.name}
        getFormattedSelectionText={suggestion => suggestion.name}
        onInputChange={mockSetInputValue}
        inputTextValue="a"
        itemSearch={{ search: jest.fn().mockReturnValue([{ name: "apple" }]) }}
      />
    );

    const input = getByLabelText(inputLabelText);
    userEvent.click(input);

    const suggestion = getByRole("option");
    userEvent.click(suggestion);

    expect(mockSetInputValue).toHaveBeenCalledWith(expect.anything(), {
      method: expect.anything(),
      newValue: "apple",
    });
  });

  describe("when maxResults is passed", () => {
    it("limits results to maxResults value", () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, queryByText, getAllByRole } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          onInputChange={mockSetInputValue}
          inputTextValue="a"
          itemSearch={
            new Search(
              ["name"],
              [{ name: "apple" }, { name: "banana" }, { name: "pear" }]
            )
          }
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

  describe("when multiSection is true", () => {
    it("will display section title and suggestion", () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, getByText, getByRole } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          onInputChange={mockSetInputValue}
          inputTextValue="a"
          itemSearch={{
            search: jest.fn().mockReturnValue([
              {
                title: "fruits",
                fruits: [{ name: "apple" }],
              },
            ]),
          }}
          multiSection={true}
          renderSectionTitle={section => section.title}
          getSectionSuggestions={section => section.fruits}
        />
      );

      const input = getByLabelText(inputLabelText);
      userEvent.click(input);

      const sectionTitleComponent = getByText("fruits");
      expect(sectionTitleComponent).toBeInTheDocument();
      const suggestion = getByRole("option", { name: "a pple" });
      expect(suggestion).toBeInTheDocument();
    });

    it("will display each section title and associated suggestions", () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, getByText, getByRole } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          onInputChange={mockSetInputValue}
          inputTextValue="e"
          itemSearch={{
            search: jest.fn().mockReturnValue([
              {
                title: "fruits",
                fruits: [{ name: "apple" }],
              },
              {
                title: "clothes",
                fruits: [{ name: "trousers" }, { name: "blouse" }],
              },
            ]),
          }}
          multiSection={true}
          renderSectionTitle={section => section.title}
          getSectionSuggestions={section => section.fruits}
        />
      );

      const input = getByLabelText(inputLabelText);
      userEvent.click(input);

      expect(getByText("fruits")).toBeInTheDocument();
      expect(getByText("clothes")).toBeInTheDocument();
      expect(getByRole("option", { name: "appl e" })).toBeInTheDocument();
      expect(getByRole("option", { name: "trous e rs" })).toBeInTheDocument();
      expect(getByRole("option", { name: "blous e" })).toBeInTheDocument();
    });
  });

  describe("text substring highlighting", () => {
    it("applies text-match--highlighted class to substring of suggestion that matches input text", () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, getByText } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          onInputChange={mockSetInputValue}
          inputTextValue="app"
          itemSearch={{
            search: jest.fn().mockReturnValue([{ name: "apple" }]),
          }}
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

    it("applies text-match--highlighted class despite different casing", () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, getByText } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          onInputChange={mockSetInputValue}
          inputTextValue="APP"
          itemSearch={{
            search: jest.fn().mockReturnValue([{ name: "apple" }]),
          }}
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

    it("returns two text-match--highlighted spans that match text input with multiple words", () => {
      const mockSetInputValue = jest.fn();
      const { getByLabelText, getByText } = render(
        <Autosuggest
          inputLabelText={inputLabelText}
          getSuggestionListItemText={suggestion => suggestion.name}
          getFormattedSelectionText={suggestion => suggestion.name}
          onInputChange={mockSetInputValue}
          inputTextValue="ap le"
          itemSearch={{
            search: jest.fn().mockReturnValue([{ name: "apple" }]),
          }}
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
