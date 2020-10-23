import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../Form";
import Button from "../Button";
import PracticeSearchBar from "../PracticeSearchBar";
import { useSearch } from "../../library/hooks/useSearch";

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
  const [selectedValue, setSelectedValue] = useState({ odsCode: "" });
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);

  const search = useSearch({
    uniqueSearchKey: "odsCode",
    searchKeys,
    sourceDocuments: practices,
  });

  const getSuggestionValue = value => {
    setSelectedValue(value);
    return value[uniqueSearchKey];
  };

  const onAutosuggestInputChange = newValue => {
    // This overrides the ODS code when the user has just selected an option and then edits the input
    if (selectedValue.name && newValue !== selectedValue.name) {
      setSelectedValue({ odsCode: newValue });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const odsCode = selectedValue.odsCode || inputTextValue;

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
          testid={testid}
          inputLabelText="Enter an ODS code"
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
