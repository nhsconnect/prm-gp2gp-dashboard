import React, { useState } from "react";
import { useStaticQuery, graphql, navigate } from "gatsby";
import Form from "../Form";
import Button from "../Button";
import Input from "../Input";
import "./index.scss";

const PracticeSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(null);

  const data = useStaticQuery(
    graphql`
      query {
        allFile(filter: { name: { eq: "practiceMetadata" } }) {
          edges {
            node {
              childPracticesJson {
                practices {
                  odsCode
                }
              }
            }
          }
        }
      }
    `
  ).allFile.edges[0].node.childPracticesJson.practices;

  const handleSubmit = e => {
    e.preventDefault();
    const inputLength = inputValue.length;

    if (inputLength < 5 || inputLength > 6) {
      setInputError("Please enter a valid ODS code");
      return;
    }

    const practice = data.find(
      item => item.odsCode === inputValue.toUpperCase()
    );

    if (practice) {
      navigate(`/practice/${practice.odsCode}`);
    } else {
      setInputError("Please enter a valid ODS code");
    }
  };

  return (
    <div className="gp2gp-practice-search">
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <Input
          className="nhsuk-input--width-10"
          testid="practice-search"
          type="text"
          hint="Enter an ODS code"
          error={inputError}
          onChange={e => setInputValue(e.currentTarget.value)}
        >
          <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">
            Search for a GP practice
          </h1>
        </Input>
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
