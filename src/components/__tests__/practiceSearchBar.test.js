import React from "react";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PracticeSearchBar from "../PracticeSearchBar/index";
import * as featureToggle from "../../library/hooks/useFeatureToggle";

describe("PracticeSearchBar component", () => {
  const SOURCE_SUGGESTION_LIST = [
    { name: "apple" },
    { name: "banana" },
    { name: "mango" },
  ];
  const inputLabelText = "Enter value";

  it("updates input value with text that the user has inputted", async () => {
    featureToggle.useFeatureToggle = jest.fn().mockReturnValue(true);
    const { getByLabelText } = render(
      <PracticeSearchBar
        sourceDocuments={SOURCE_SUGGESTION_LIST}
        inputLabelText={inputLabelText}
      />
    );
    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, "app");
    expect(input).toHaveValue("app");
  });
});
