import React from "react";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";
import Input from "../Input";

const PracticeSearchBar = ({ inputError, setInputValue }) => {
  const newSearch = useFeatureToggle("F_PRACTICE_NAME_SEARCH");

  return newSearch ? (
    "NEW SEARCH"
  ) : (
    <Input
      className="nhsuk-input--width-10"
      testid="practice-search"
      type="text"
      hint={"Enter an ODS code"}
      error={inputError}
      onChange={e => setInputValue(e.currentTarget.value)}
    >
      <h1 className="nhsuk-heading-l nhsuk-u-margin-bottom-0">
        Search for a GP practice
      </h1>
    </Input>
  );
};

export default PracticeSearchBar;
