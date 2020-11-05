import React, { useState } from "react";
import { navigate } from "gatsby";

import Form from "../FormComponents/Form";
import Button from "../FormComponents/Button";
import Autosuggest from "../FormComponents/Autosuggest";
import { Search } from "../../library/utils/search/index";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase/index";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle/index";

import organisationSearchContent from "../../data/content/organisationSearch.json";
import organisationMetadata from "../../data/organisations/organisationMetadata.json";
import "./index.scss";

const practiceSearch = new Search(
  ["name", "odsCode"],
  organisationMetadata.practices
);

const ccgSearch = new Search(["name", "odsCode"], organisationMetadata.ccgs);

const OrganisationSearch = () => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);
  const [selectedOdsCode, setSelectedOdsCode] = useState("");
  const isSearchByCCGOn = useFeatureToggle("F_SEARCH_BY_CCG");

  const findSuggestions = value => {
    return isSearchByCCGOn
      ? [
          {
            title: "ccgs",
            organisations: ccgSearch
              .search(value, 50)
              .map(item => ({ ...item, path: `/ccg/${item.odsCode}` })),
          },
          {
            title: "practices",
            organisations: practiceSearch
              .search(value, 50)
              .map(item => ({ ...item, path: `/practice/${item.odsCode}` })),
          },
        ]
      : practiceSearch.search(value, 100);
  };

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

    const result = findSuggestions(selectedOdsCode || inputTextValue);

    if (isSearchByCCGOn) {
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
    } else {
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
          multiSection={isSearchByCCGOn}
          renderSectionTitle={section => section.title}
          getSectionSuggestions={section => section.organisations}
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
