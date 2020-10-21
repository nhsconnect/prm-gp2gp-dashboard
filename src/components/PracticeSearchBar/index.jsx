import React, { useState } from "react";
import Autosuggest from "react-autosuggest";

import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";
import Input from "../Input";

const renderSuggestion = suggestion => <div>{suggestion}</div>;

const PracticeSearchBar = ({ inputError, setInputValue, testid }) => {
  const newSearch = useFeatureToggle("F_PRACTICE_NAME_SEARCH");
  const [autosuggestValue, setAutosuggestValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions([]);
  };
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    value: autosuggestValue,
    onChange: (event, { newValue }) => {
      setAutosuggestValue(newValue);
    },
  };

  return newSearch ? (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={value => value}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  ) : (
    <Input
      error={inputError}
      className="nhsuk-input--width-10"
      testid={testid}
      onChange={e => setInputValue(e.currentTarget.value)}
    />
  );
};

export default PracticeSearchBar;
