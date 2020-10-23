import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../FormComponents/Form";
import Button from "../FormComponents/Button";
import Autosuggest from "../FormComponents/Autosuggest";
import { useSearch } from "../../library/hooks/useSearch";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";

import practiceMetadata from "../../data/practices/practiceMetadata.json";
import "./index.scss";

const uniqueSearchKey = "odsCode";
const searchKeys = ["name", "odsCode"];

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const renderSuggestion = suggestion => {
  return (
    <>
      {toTitleCase(suggestion.name)} | {suggestion.odsCode}
    </>
  );
};

const testid = "practice-search";

const practices = practiceMetadata.practices;

const PracticeSearch = () => {
  const [selectedValue, setSelectedValue] = useState({ odsCode: "" });
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);

  const newSearch = useFeatureToggle("F_PRACTICE_NAME_SEARCH");

  const search = useSearch({
    uniqueSearchKey: uniqueSearchKey,
    searchKeys,
    sourceDocuments: practices,
  });

  const getSuggestionValue = value => {
    setSelectedValue({ ...value, name: toTitleCase(value.name) });
    return `${toTitleCase(value["name"])} | ${value["odsCode"]}`;
  };

  const onAutosuggestInputChange = newValue => {
    // This overrides the ODS code when the user has just selected an option and then edits the input
    if (selectedValue.name && toTitleCase(newValue) !== selectedValue.name) {
      setSelectedValue({});
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const searchVal = selectedValue.odsCode || inputTextValue;

    const result = search.search(searchVal);

    if (result.length === 0) {
      setInputError(
        newSearch
          ? "Please enter a valid practice name or ODS code"
          : "Please enter a valid ODS code"
      );
    } else if (result.length > 1) {
      setInputError(
        `Multiple results matching '${searchVal}'. Please select an option from the dropdown.`
      );
    } else if (result.length === 1) {
      const odsCode = result[0].odsCode;
      navigate(`/practice/${odsCode}`);
    }
  };

  return (
    <div className="gp2gp-practice-search">
      <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">Search</h1>
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <Autosuggest
          inputError={inputError}
          setSelectedValue={setSelectedValue}
          testid={testid}
          inputLabelText="Enter a practice name or ODS code"
          renderSuggestion={renderSuggestion}
          getSuggestionValue={getSuggestionValue}
          inputTextValue={inputTextValue}
          search={search}
          setInputTextValue={setInputTextValue}
          onAutosuggestInputChange={onAutosuggestInputChange}
        />
        <Button
          className="nhsuk-u-margin-top-3 gp2gp-practice-search__button"
          type="submit"
          testid="practice-search-button"
        >
          Search
        </Button>
      </Form>
    </div>
  );
};

export default PracticeSearch;
