import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../Form";
import Button from "../Button";
import PracticeSearchBar from "../PracticeSearchBar";
import { useSearch } from "../../library/hooks/useSearch";

import practiceMetadata from "../../data/practices/practiceMetadata.json";
import "./index.scss";

const searchKeys = ["name", "odsCode"];

const PracticeSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(null);
  const search = useSearch({
    uniqueSearchKey: "odsCode",
    searchKeys,
    sourceDocuments: practiceMetadata.practices,
  });

  const practices = practiceMetadata.practices;

  const handleSubmit = e => {
    e.preventDefault();
    const inputLength = inputValue.length;

    if (inputLength < 5 || inputLength > 6) {
      setInputError("Please enter a valid ODS code");
      return;
    }

    const practice = practices.find(
      item => item.odsCode === inputValue.toUpperCase()
    );

    if (practice) {
      navigate(`/practice/${practice.odsCode}`);
    } else {
      setInputError("Please enter a valid ODS code");
    }
  };

  const testid = "practice-search";

  const uniqueSearchKey = "name";
  const getSuggestionValue = value => value[uniqueSearchKey];
  const renderSuggestion = suggestion => {
    return <>{suggestion.name}</>;
  };

  return (
    <div className="gp2gp-practice-search">
      <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">
        Search for a GP practice
      </h1>
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <PracticeSearchBar
          inputError={inputError}
          setInputValue={setInputValue}
          testid={testid}
          inputLabelText="Enter an ODS code"
          search={search}
          renderSuggestion={renderSuggestion}
          getSuggestionValue={getSuggestionValue}
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
