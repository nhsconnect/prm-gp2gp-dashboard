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
        practiceMetadata: allFile(
          filter: { name: { eq: "practiceMetadata" } }
        ) {
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
        content: allFile(filter: { name: { eq: "practiceSearch" } }) {
          edges {
            node {
              childContentJson {
                inputLabel
                inputHint
                inputErrorMessage
                buttonLabel
              }
            }
          }
        }
      }
    `
  );

  const practices =
    data.practiceMetadata.edges[0].node.childPracticesJson.practices;
  const {
    inputLabel,
    inputHint,
    inputErrorMessage,
    buttonLabel,
  } = data.content.edges[0].node.childContentJson;

  const handleSubmit = e => {
    e.preventDefault();
    const inputLength = inputValue.length;

    if (inputLength < 5 || inputLength > 6) {
      setInputError(inputErrorMessage);
      return;
    }

    const practice = practices.find(
      item => item.odsCode === inputValue.toUpperCase()
    );

    if (practice) {
      navigate(`/practice/${practice.odsCode}`);
    } else {
      setInputError(inputErrorMessage);
    }
  };

  return (
    <div className="gp2gp-practice-search">
      <Form onSubmit={handleSubmit} hasError={!!inputError}>
        <Input
          className="nhsuk-input--width-10"
          testid="practice-search"
          type="text"
          hint={inputHint}
          error={inputError}
          onChange={e => setInputValue(e.currentTarget.value)}
        >
          <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">
            {inputLabel}
          </h1>
        </Input>
        <Button
          className="nhsuk-u-margin-top-3 gp2gp-practice-search__button"
          type="submit"
          testid="practice-search-button"
        >
          {buttonLabel}
        </Button>
      </Form>
    </div>
  );
};

export default PracticeSearch;
