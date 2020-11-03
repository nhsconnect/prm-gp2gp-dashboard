import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../FormComponents/Form";
import Button from "../FormComponents/Button";
import Autosuggest from "../FormComponents/Autosuggest";
import { useSearch } from "../../library/hooks/useSearch";
import { convertToTitleCase } from "../../library/common/index";

import organisationMetadata from "../../data/organisations/organisationMetadata.json";
import "./index.scss";

const uniqueSearchKey = "odsCode";
const searchKeys = ["name", "odsCode"];

const practices = organisationMetadata.practices;

const OrganisationSearch = () => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);

  const search = useSearch({
    uniqueSearchKey,
    searchKeys,
    sourceDocuments: practices,
  });

  const getSuggestionListItemText = suggestion => {
    return `${convertToTitleCase(suggestion.name)} | ${suggestion.odsCode}`;
  };

  const getFormattedSelectionText = value => {
    return `${convertToTitleCase(value["name"])} | ${value["odsCode"]}`;
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
      setInputError("Please enter a valid practice name or ODS code");
    }
  };

  return (
    <div className="gp2gp-practice-search">
      <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">Search</h1>
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <Autosuggest
          inputError={inputError}
          inputLabelText="Enter a practice name or ODS code"
          getSuggestionListItemText={getSuggestionListItemText}
          getFormattedSelectionText={getFormattedSelectionText}
          inputTextValue={inputTextValue}
          search={search}
          setInputTextValue={setInputTextValue}
          maxResults={100}
        />
        <Button
          className="nhsuk-u-margin-top-3 gp2gp-practice-search__button"
          type="submit"
        >
          Search
        </Button>
      </Form>
    </div>
  );
};

export default OrganisationSearch;
