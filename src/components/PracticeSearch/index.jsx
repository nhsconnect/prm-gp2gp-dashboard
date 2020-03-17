import React, { useState } from "react";
import { useStaticQuery, graphql, navigate } from "gatsby";
import { Button, Form, Input } from "nhsuk-react-components";
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
      <Form onSubmit={handleSubmit}>
        <Input
          id="practice-search-input"
          width="10"
          error={inputError}
          hint="Enter an ODS code"
          onChange={e => setInputValue(e.currentTarget.value)}
          data-testid="practice-search-input"
        >
          <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">
            Search for a GP practice
          </h1>
        </Input>
        <Button
          className="gp2gp-practice-search__button nhsuk-u-margin-top-3"
          type="submit"
          data-testid="practice-search-button"
        >
          Search
        </Button>
      </Form>
    </div>
  );
};

export default PracticeSearch;
