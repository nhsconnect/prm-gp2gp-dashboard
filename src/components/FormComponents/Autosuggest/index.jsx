import React, { useState } from "react";
import ReactAutosuggest from "react-autosuggest";
import Highlighter from "react-highlight-words";

import Input from "../Input";
import "./index.scss";

const Autosuggest = ({
  inputError,
  testid,
  inputLabelText,
  getSuggestionListItemText,
  getFormattedSelectionText,
  search,
  inputTextValue = "",
  setInputTextValue,
  maxResults,
  newSearchToggle,
}) => {
  const [suggestions, setSuggestions] = useState([]);

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(search.search(value).slice(0, maxResults));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    value: inputTextValue,
    onChange: (_, { newValue }) => {
      setInputTextValue(newValue);
    },
    className: inputError
      ? "react-autosuggest__input--error"
      : "react-autosuggest__input",
  };

  const renderSuggestion = (suggestion, { query }) => {
    return (
      <Highlighter
        highlightClassName="text-match--highlighted"
        searchWords={query.split(" ")}
        textToHighlight={getSuggestionListItemText(suggestion)}
        autoEscape={true}
      />
    );
  };

  return (
    <label date-testid={`${testid}-label`}>
      <span className="nhsuk-hint" data-testid={`${testid}-hint`}>
        {inputLabelText}
      </span>
      {inputError && (
        <span
          className="nhsuk-error-message"
          data-testid={`${testid}-error`}
          role="alert"
        >
          {inputError}
        </span>
      )}
      {newSearchToggle ? (
        <ReactAutosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getFormattedSelectionText}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      ) : (
        <Input
          error={inputError}
          className="nhsuk-input--width-10"
          testid={testid}
          onChange={e => setInputTextValue(e.currentTarget.value)}
        />
      )}
    </label>
  );
};

export default Autosuggest;
