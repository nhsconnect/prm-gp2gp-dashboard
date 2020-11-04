import React, { useState } from "react";
import ReactAutosuggest from "react-autosuggest";
import Highlighter from "react-highlight-words";

import "./index.scss";

const Autosuggest = ({
  inputError,
  inputLabelText,
  getSuggestionListItemText,
  getFormattedSelectionText,
  search,
  inputTextValue = "",
  onInputChange,
  maxResults,
  multiSection,
  renderSectionTitle,
  getSectionSuggestions,
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
    onChange: onInputChange,
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

  const multiSectionProps = multiSection
    ? { multiSection, renderSectionTitle, getSectionSuggestions }
    : {};

  return (
    <label>
      <span className="nhsuk-hint">{inputLabelText}</span>
      {inputError && (
        <span className="nhsuk-error-message" role="alert">
          {inputError}
        </span>
      )}
      <ReactAutosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getFormattedSelectionText}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        {...multiSectionProps}
      />
    </label>
  );
};

export default Autosuggest;
