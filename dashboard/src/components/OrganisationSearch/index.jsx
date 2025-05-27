import React, { useState } from "react";
import { navigate, graphql, useStaticQuery } from "gatsby";

import { Form } from "../common/FormComponents/Form";
import { Button } from "../common/Button";
import { Autosuggest } from "../common/FormComponents/Autosuggest";
import { Search } from "../../library/utils/search/index";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase/index";

import organisationSearchContent from "../../data/content/organisationSearch.json";

import "./index.scss";
import { useHasMounted } from "../../library/hooks/useHasMounted";

const initializeSearch = (organisations, orgType) => {
  return new Search(
    "odsCode",
    ["name", "odsCode"],
    organisations.map((item) => ({
      ...item,
      path: `/${orgType}/${item.odsCode}/integration-times`,
    }))
  );
};

export const OrganisationSearch = () => {
  const [inputTextValue, setInputTextValue] = useState("");
  const [inputError, setInputError] = useState(null);
  const [selectedOdsCode, setSelectedOdsCode] = useState("");
  const { hasMounted } = useHasMounted();

  const data = useStaticQuery(
    graphql`
      query {
        allFile(filter: { name: { eq: "practiceMetrics" } }) {
          edges {
            node {
              childOrganisationsJson {
                practices {
                  name
                  odsCode
                }
                sicbls {
                  name
                  odsCode
                }
              }
            }
          }
        }
      }
    `
  ).allFile.edges[0].node.childOrganisationsJson;

  const [practiceSearch] = useState(() =>
    initializeSearch(data.practices, "practice")
  );
  const [sicblSearch] = useState(() =>
    initializeSearch(data.sicbls, "sub-ICB-location")
  );

  const findSuggestions = (value) => [
    {
      title: "Sub ICB Location",
      organisations: sicblSearch.search(value, 50),
    },
    {
      title: "GP practice",
      organisations: practiceSearch.search(value, 50),
    },
  ];

  const getSuggestionListItemText = (suggestion) => {
    if (suggestion.name.includes("ICB")) {
      return convertToTitleCase(suggestion.name);
    }

    return `${convertToTitleCase(suggestion.name)} - ${suggestion.odsCode}`;
  };

  const getFormattedSelectionText = (value) => {
    setSelectedOdsCode(value.odsCode);
    if (value.name.includes("ICB")) {
      return convertToTitleCase(value.name);
    }

    return `${convertToTitleCase(value.name)} - ${value.odsCode}`;
  };

  const onInputChange = (_, { newValue, method }) => {
    if (method === "type") {
      setSelectedOdsCode("");
    }
    setInputTextValue(newValue);
  };

  const handleSubmit = (e) => {
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
      <h2 className="nhsuk-u-margin-bottom-0">
        {organisationSearchContent.heading}
      </h2>
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <Autosuggest
          inputProps={{
            disabled: !hasMounted,
            placeholder: hasMounted ? "" : "Loading...",
          }}
          inputError={inputError}
          inputLabelText={organisationSearchContent.inputLabel}
          getSuggestionListItemText={getSuggestionListItemText}
          getFormattedSelectionText={getFormattedSelectionText}
          inputTextValue={inputTextValue}
          findSuggestions={findSuggestions}
          onInputChange={onInputChange}
          multiSection={true}
          renderSectionTitle={(section) => section.title}
          getSectionSuggestions={(section) => section.organisations}
        />
        <Button
          disabled={!hasMounted}
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
