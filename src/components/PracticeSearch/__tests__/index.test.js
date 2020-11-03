import React from "react";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PracticeSearch from "../index";

jest.mock(
  "../../../data/organisations/organisationMetadata.json",
  () => ({
    practices: [
      { odsCode: "A12345", name: "Test Practice" },
      { odsCode: "X99999", name: "Second Practice" },
    ],
  }),
  { virtual: true }
);

describe("PracticeSearch component", () => {
  const validOdsCode = "A12345";
  const validPracticeName = "Test Practice";
  const inputLabelText = "Enter a practice name or ODS code";

  it("navigates to a practice page when searching for and selecting an ods code", async () => {
    const { getByLabelText, getByText, getByRole } = render(<PracticeSearch />);

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, "A123");

    const suggestion = getByText("Test Practice |");
    userEvent.click(suggestion);

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
    expect(Gatsby.navigate).toHaveBeenCalledWith(`/practice/${"A12345"}`);
  });

  it("navigates to a practice page on existing practice name input", async () => {
    const { getByLabelText, getByText, getByRole } = render(<PracticeSearch />);

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, validPracticeName);

    const suggestion = getByText(`| ${validOdsCode}`);
    userEvent.click(suggestion);

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
    expect(Gatsby.navigate).toHaveBeenCalledWith(`/practice/${validOdsCode}`);
  });

  it("navigates to a practice page when typing valid ods code and not selecting", async () => {
    const { getByLabelText, getByRole } = render(<PracticeSearch />);

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, validOdsCode);

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
    expect(Gatsby.navigate).toHaveBeenCalledWith(`/practice/${validOdsCode}`);
  });

  it("navigates to a practice page entering partial search with one result", async () => {
    const { getByLabelText, getByRole } = render(<PracticeSearch />);

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, "A12");

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
    expect(Gatsby.navigate).toHaveBeenCalledWith(`/practice/${validOdsCode}`);
  });

  it("displays error message when user alters input text after selecting a suggestion", async () => {
    const { getByLabelText, getByText, getByRole } = render(<PracticeSearch />);

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, validOdsCode);

    const suggestion = getByText(validOdsCode);
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
    const { getByLabelText, getByText, getByRole } = render(<PracticeSearch />);

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
    const { getByLabelText, getByText, getByRole } = render(<PracticeSearch />);

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
