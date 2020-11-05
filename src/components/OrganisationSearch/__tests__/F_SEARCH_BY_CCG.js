import React from "react";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrganisationSearch from "../index";
import * as featureToggle from "../../../library/hooks/useFeatureToggle/index";

jest.mock(
  "../../../data/organisations/organisationMetadata.json",
  () => ({
    practices: [
      { odsCode: "A12345", name: "Test Practice" },
      { odsCode: "X99999", name: "Second Practice" },
    ],
    ccgs: [
      { odsCode: "12A", name: "Test CCG" },
      { odsCode: "13B", name: "Second CCG" },
    ],
  }),
  { virtual: true }
);

describe("OrganisationSearch component with F_SEARCH_BY_CCG toggled off", () => {
  const validPracticeOdsCode = "A12345";
  const validPracticeName = "Test Practice";
  const inputLabelText = "Enter a practice name or ODS code";
  const validCCGOdsCode = "12A";
  const validCCGName = "Test CCG";

  beforeAll(() => {
    featureToggle.useFeatureToggle = jest.fn().mockReturnValue(false);
  });

  describe("navigation to practice page", () => {
    it("when searching for and selecting an ods code", async () => {
      const { getByLabelText, getByText, getByRole } = render(
        <OrganisationSearch />
      );

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, "A123");

      const suggestion = getByText("Test Practice |");
      userEvent.click(suggestion);

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);

      expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
      expect(Gatsby.navigate).toHaveBeenCalledWith(`/practice/${"A12345"}`);
    });

    it("on existing practice name input", async () => {
      const { getByLabelText, getByText, getByRole } = render(
        <OrganisationSearch />
      );

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, validPracticeName);

      const suggestion = getByText(`| ${validPracticeOdsCode}`);
      userEvent.click(suggestion);

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);

      expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
      expect(Gatsby.navigate).toHaveBeenCalledWith(
        `/practice/${validPracticeOdsCode}`
      );
    });

    it("when typing valid ods code and not selecting", async () => {
      const { getByLabelText, getByRole } = render(<OrganisationSearch />);

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, validPracticeOdsCode);

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);

      expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
      expect(Gatsby.navigate).toHaveBeenCalledWith(
        `/practice/${validPracticeOdsCode}`
      );
    });

    it("entering partial search with one result", async () => {
      const { getByLabelText, getByRole } = render(<OrganisationSearch />);

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, "A12");

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);

      expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
      expect(Gatsby.navigate).toHaveBeenCalledWith(
        `/practice/${validPracticeOdsCode}`
      );
    });
  });

  it("when searching for a ods code will not return a result", async () => {
    const { getByLabelText, queryByText } = render(<OrganisationSearch />);

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, validCCGOdsCode);

    expect(queryByText(`${validCCGName} |`)).toBeNull();
  });

  it("on existing CCG name input will not return a result", async () => {
    const { getByLabelText, queryByText } = render(<OrganisationSearch />);

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, validCCGName);

    expect(queryByText(`| ${validCCGOdsCode}`)).toBeNull();
  });

  it("displays error message when user alters input text after selecting a suggestion", async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <OrganisationSearch />
    );

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, validPracticeOdsCode);

    const suggestion = getByText(validPracticeOdsCode);
    userEvent.click(suggestion);

    await userEvent.type(input, "Wrong");

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    expect(
      getByText("Please enter a valid practice name or ODS code")
    ).toBeInTheDocument();
    expect(Gatsby.navigate).toHaveBeenCalledTimes(0);
  });

  it("displays an error on invalid ODS code input", async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <OrganisationSearch />
    );

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, "B00000");

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    expect(
      getByText("Please enter a valid practice name or ODS code")
    ).toBeInTheDocument();
    expect(Gatsby.navigate).toHaveBeenCalledTimes(0);
  });

  it("displays an error when search returns multiple results", async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <OrganisationSearch />
    );

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, "Practice");

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    expect(
      getByText(
        "Multiple results matching 'Practice'. Please select an option from the dropdown."
      )
    ).toBeInTheDocument();
    expect(Gatsby.navigate).toHaveBeenCalledTimes(0);
  });
});
