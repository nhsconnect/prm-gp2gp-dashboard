import React, { useState } from "react";
import { useStaticQuery, graphql, navigate } from "gatsby";
import { Button, Form, Input } from "nhsuk-react-components";

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

    const practice = data.find(item => item.odsCode === inputValue);

    if (practice) {
      navigate(`/practice/${practice.odsCode}`);
    } else {
      setInputError("Please enter a valid ODS code");
    }
  };

  return (
    <React.Fragment>
      <Form onSubmit={handleSubmit}>
        <Input
          id="input-ods-code"
          width="10"
          style={{ marginRight: 10 }}
          error={inputError}
          onChange={e => setInputValue(e.currentTarget.value)}
        >
          Search for a GP practice
        </Input>
        <Button type="submit">Search</Button>
      </Form>
    </React.Fragment>
  );
};

export default PracticeSearch;
