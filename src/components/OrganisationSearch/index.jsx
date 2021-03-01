import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../FormComponents/Form";
import Button from "../Button";
import Autosuggest from "../FormComponents/Autosuggest";
import { Search } from "../../library/utils/search/index";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase/index";

import organisationSearchContent from "../../data/content/organisationSearch.json";
import organisationMetadata from "../../data/organisations/organisationMetadata.json";
import "./index.scss";

const practiceSearch = new Search(
  "odsCode",
  ["name", "odsCode"],
  organisationMetadata.practices.map(item => ({
    ...item,
    path: `/practice/${item.odsCode}`,
  }))
);

const ccgSearch = new Search(
  "odsCode",
  ["name", "odsCode"],
  organisationMetadata.ccgs.map(item => ({
    ...item,
    path: `/ccg/${item.odsCode}`,
  }))
);

const OrganisationSearch = () => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);
  const [selectedOdsCode, setSelectedOdsCode] = useState("");

  const findSuggestions = value => [
    {
      title: "Clinical Commissioning Group",
      organisations: ccgSearch.search(value, 50),
    },
    {
      title: "GP practice",
      organisations: practiceSearch.search(value, 50),
    },
  ];

  const getSuggestionListItemText = suggestion => {
    return `${convertToTitleCase(suggestion.name)} | ${suggestion.odsCode}`;
  };

  const getFormattedSelectionText = value => {
    setSelectedOdsCode(value.odsCode);
    return `${convertToTitleCase(value.name)} | ${value.odsCode}`;
  };

  const onInputChange = (_, { newValue, method }) => {
    if (method === "type") {
      setSelectedOdsCode("");
    }
    setInputTextValue(newValue);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const result = findSuggestions(selectedOdsCode || inputTextValue);

    const allSearchResults = [
      ...result[0].organisations,
      ...result[1].organisations,
    ];

    if (allSearchResults.length === 1) {
      navigate(allSearchResults[0].path);
    } else if (allSearchResults.length > 1) {
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
          findSuggestions={findSuggestions}
          onInputChange={onInputChange}
          multiSection={true}
          renderSectionTitle={section => section.title}
          getSectionSuggestions={section => section.organisations}
        />
        <Button
          dataTestId="gp2gp-practice-search__button"
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
