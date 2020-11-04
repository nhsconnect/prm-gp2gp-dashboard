import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../FormComponents/Form";
import Button from "../FormComponents/Button";
import Autosuggest from "../FormComponents/Autosuggest";
import { useSearch } from "../../library/hooks/useSearch";
import { convertToTitleCase } from "../../library/common/index";

import organisationMetadata from "../../data/organisations/organisationMetadata.json";
import "./index.scss";

const searchKeys = ["name", "odsCode"];

const practices = organisationMetadata.practices;

const OrganisationSearch = () => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);
  const [selectedOdsCode, setSelectedOdsCode] = useState("");

  const search = useSearch({
    keys: searchKeys,
    list: practices,
  });

  const getSuggestionListItemText = suggestion => {
    return `${convertToTitleCase(suggestion.name)} | ${suggestion.odsCode}`;
  };

  const getFormattedSelectionText = value => {
    setSelectedOdsCode(value["odsCode"]);
    return `${convertToTitleCase(value["name"])} | ${value["odsCode"]}`;
  };

  const onInputChange = (_, { newValue, method }) => {
    if (method === "type") {
      setSelectedOdsCode("");
    }
    setInputTextValue(newValue);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const result = search.search(selectedOdsCode || inputTextValue);

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
          maxResults={100}
          onInputChange={onInputChange}
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
