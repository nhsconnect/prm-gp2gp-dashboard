import React, { useState } from "react";
import Autosuggest from "react-autosuggest";

import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";
import Input from "../Input";
import "./index.scss";

const PracticeSearchBar = ({
  inputError,
  setSelectedValue,
  testid,
  inputLabelText,
  renderSuggestion,
  getSuggestionValue,
  search,
  inputTextValue = "",
  onAutosuggestInputChange = () => {},
  setInputTextValue,
}) => {
  const newSearch = useFeatureToggle("F_PRACTICE_NAME_SEARCH");
  const [suggestions, setSuggestions] = useState([]);

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(search.search(value).slice(0, 5));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    value: inputTextValue,
    onChange: (_, { newValue }) => {
      onAutosuggestInputChange(newValue);
      setInputTextValue(newValue);
    },
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
      {newSearch ? (
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
      ) : (
        <Input
          error={inputError}
          className="nhsuk-input--width-10"
          testid={testid}
          onChange={e => setSelectedValue({ odsCode: e.currentTarget.value })}
        />
      )}
    </label>
  );
};

export default PracticeSearchBar;
