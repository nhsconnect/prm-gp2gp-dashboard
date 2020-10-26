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
  return `${toTitleCase(suggestion.name)} | ${suggestion.odsCode}`;
};

const testid = "practice-search";

const practices = practiceMetadata.practices;

const PracticeSearch = () => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);

  const newSearch = useFeatureToggle("F_PRACTICE_NAME_SEARCH");

  const search = useSearch({
    uniqueSearchKey: uniqueSearchKey,
    searchKeys,
    sourceDocuments: practices,
  });

  const getFormattedSelectionText = value => {
    return `${toTitleCase(value["name"])} | ${value["odsCode"]}`;
  };

  const handleSubmit = e => {
    e.preventDefault();

    const result = search.search(inputTextValue);

    if (result.length === 1) {
      const odsCode = result[0].odsCode;
      navigate(`/practice/${odsCode}`);
    } else if (result.length > 1) {
      setInputError(
        `Multiple results matching '${inputTextValue}'. Please select an option from the dropdown.`
      );
    } else {
      setInputError(
        newSearch
          ? "Please enter a valid practice name or ODS code"
          : "Please enter a valid ODS code"
      );
    }
  };

  return (
    <div className="gp2gp-practice-search">
      <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">Search</h1>
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <Autosuggest
          inputError={inputError}
          testid={testid}
          inputLabelText="Enter a practice name or ODS code"
          renderSuggestion={renderSuggestion}
          getFormattedSelectionText={getFormattedSelectionText}
          inputTextValue={inputTextValue}
          search={search}
          setInputTextValue={setInputTextValue}
          maxResults={500}
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
