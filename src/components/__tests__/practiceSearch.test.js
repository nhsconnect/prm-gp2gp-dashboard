import React from "react";
import * as Gatsby from "gatsby";
import { render, fireEvent } from "@testing-library/react";
import PracticeSearch from "../PracticeSearch/index";

jest.mock("../../data/practices/practiceMetadata.json", () => ({
  practices: [{ odsCode: "A12345", name: "Test Practice" }],
}));
describe("PracticeSearch component", () => {
  it("navigates to a practice page on upper case existing ODS code input", () => {
    const validOdsCode = "A12345";
    const { getByTestId } = render(<PracticeSearch />);

    fireEvent.change(getByTestId("practice-search-input"), {
      target: { value: validOdsCode },
    });
    fireEvent.click(getByTestId("practice-search-button"));

    expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
    expect(Gatsby.navigate).toHaveBeenCalledWith(`/practice/${validOdsCode}`);
  });

  it("navigates to a practice page on lower case existing ODS code input", () => {
    const lowerCaseOdsCode = "a12345";
    const upperCaseOdsCode = "A12345";
    const { getByTestId } = render(<PracticeSearch />);

    fireEvent.change(getByTestId("practice-search-input"), {
      target: { value: lowerCaseOdsCode },
    });
    fireEvent.click(getByTestId("practice-search-button"));

    expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
    expect(Gatsby.navigate).toHaveBeenCalledWith(
      `/practice/${upperCaseOdsCode}`
    );
  });

  it("displays an error on non existing ODS code input", () => {
    const invalidOdsCode = "A12346";
    const { getByTestId } = render(<PracticeSearch />);

    fireEvent.change(getByTestId("practice-search-input"), {
      target: { value: invalidOdsCode },
    });
    fireEvent.click(getByTestId("practice-search-button"));

    expect(getByTestId("practice-search-error")).toBeInTheDocument();
  });

  it("displays an error on invalid ODS code input", () => {
    const invalidOdsCode = "A123";
    const { getByTestId } = render(<PracticeSearch />);

    fireEvent.change(getByTestId("practice-search-input"), {
      target: { value: invalidOdsCode },
    });
    fireEvent.click(getByTestId("practice-search-button"));

    expect(getByTestId("practice-search-error")).toBeInTheDocument();
  });
});
