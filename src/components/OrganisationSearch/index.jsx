import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../FormComponents/Form";
import Button from "../FormComponents/Button";
import Autosuggest from "../FormComponents/Autosuggest";
import { Search } from "../../library/utils/search/index";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase/index";

import organisationSearchContent from "../../data/content/organisationSearch.json";
import organisationMetadata from "../../data/organisations/organisationMetadata.json";
import "./index.scss";

const OrganisationSearch = () => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);
  const [selectedOdsCode, setSelectedOdsCode] = useState("");

  const organisationSearch = new Search(
    ["name", "odsCode"],
    organisationMetadata.practices
  );

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

    const result = organisationSearch.search(
      selectedOdsCode || inputTextValue,
      2
    );

    if (result.length === 1) {
      const odsCode = result[0].odsCode;
      navigate(`/practice/${odsCode}`);
    } else if (result.length > 1) {
      setInputError(
        `Multiple results matching '${inputTextValue}'. Please select an option from the dropdown.`
      );
    } else {
      setInputError(organisationSearchContent.inputErrorMessage);
    }
  };

  return (
    <div className="gp2gp-practice-search">
      <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">
        {organisationSearchContent.heading}
      </h1>
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <Autosuggest
          inputError={inputError}
          inputLabelText={organisationSearchContent.inputLabel}
          getSuggestionListItemText={getSuggestionListItemText}
          getFormattedSelectionText={getFormattedSelectionText}
          inputTextValue={inputTextValue}
          itemSearch={organisationSearch}
          maxResults={100}
          onInputChange={onInputChange}
        />
        <Button
          className="nhsuk-u-margin-top-3 gp2gp-practice-search__button"
          type="submit"
        >
          {organisationSearchContent.buttonLabel}
        </Button>
      </Form>
    </div>
  );
};

export default OrganisationSearch;
