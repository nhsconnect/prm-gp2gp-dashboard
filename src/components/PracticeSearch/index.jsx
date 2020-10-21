import React, { useState } from "react";
import { navigate } from "gatsby";
import Form from "../Form";
import Button from "../Button";
import PracticeSearchBar from "../PracticeSearchBar";
import practiceMetadata from "../../data/practices/practiceMetadata.json";
import "./index.scss";

const PracticeSearch = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(null);

  const practices = practiceMetadata.practices;

  const handleSubmit = e => {
    e.preventDefault();
    const inputLength = inputValue.length;

    if (inputLength < 5 || inputLength > 6) {
      setInputError("Please enter a valid ODS code");
      return;
    }

    const practice = practices.find(
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
        <PracticeSearchBar
          inputError={inputError}
          setInputValue={setInputValue}
        />
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
