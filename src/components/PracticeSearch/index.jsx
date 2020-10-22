import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../Form";
import Button from "../Button";
import PracticeSearchBar from "../PracticeSearchBar";
import { useSearch } from "../../library/hooks/useSearch";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";

import practiceMetadata from "../../data/practices/practiceMetadata.json";
import "./index.scss";

const uniqueSearchKey = "name";
const searchKeys = ["name", "odsCode"];
const renderSuggestion = suggestion => {
  return (
    <>
      {suggestion.name} | {suggestion.odsCode}
    </>
  );
};

const testid = "practice-search";

const practices = practiceMetadata.practices;

const PracticeSearch = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);
  const newSearch = useFeatureToggle("F_PRACTICE_NAME_SEARCH");

  const getSuggestionValue = value => {
    setSelectedValue(value);
    return value[uniqueSearchKey];
  };

  const search = useSearch({
    uniqueSearchKey: "odsCode",
    searchKeys,
    sourceDocuments: practices,
  });

  const handleSubmit = e => {
    e.preventDefault();
    let odsCode;
    if (newSearch) {
      odsCode = selectedValue.odsCode || inputTextValue;
    } else {
      odsCode = selectedValue;
    }

    const inputLength = odsCode.length;

    if (inputLength < 5 || inputLength > 6) {
      setInputError("Please enter a valid ODS code");
      return;
    }

    const practice = practices.find(
      item => item.odsCode === odsCode.toUpperCase()
    );

    if (practice) {
      navigate(`/practice/${practice.odsCode}`);
    } else {
      setInputError("Please enter a valid ODS code");
    }
  };

  return (
    <div className="gp2gp-practice-search">
      <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">
        Search for a GP practice
      </h1>
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <PracticeSearchBar
          inputError={inputError}
          setSelectedValue={setSelectedValue}
          selectedValue={selectedValue}
          testid={testid}
          inputLabelText="Enter an ODS code"
          search={search}
          renderSuggestion={renderSuggestion}
          getSuggestionValue={getSuggestionValue}
          inputTextValue={inputTextValue}
          setInputTextValue={setInputTextValue}
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
