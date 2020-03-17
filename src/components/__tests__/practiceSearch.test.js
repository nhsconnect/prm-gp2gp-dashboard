import React from "react";
import * as Gatsby from "gatsby";
import { render, fireEvent, cleanup } from "@testing-library/react";
import PracticeSearch from "../PracticeSearch/index";

describe("PracticeSearch component", () => {
  beforeEach(() => {
    const useStaticQuery = jest.spyOn(Gatsby, "useStaticQuery");
    useStaticQuery.mockImplementation(() => ({
      allFile: {
        edges: [
          {
            node: {
              childPracticesJson: {
                practices: [
                  {
                    odsCode: "A12345",
                  },
                ],
              },
            },
          },
        ],
      },
    }));
  });

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
    const { container, getByTestId } = render(<PracticeSearch />);

    fireEvent.change(getByTestId("practice-search-input"), {
      target: { value: invalidOdsCode },
    });
    fireEvent.click(getByTestId("practice-search-button"));

    expect(
      container.querySelector("#practice-search-input-error")
    ).toBeInTheDocument();
  });

  it("displays an error on invalid ODS code input", () => {
    const invalidOdsCode = "A123";
    const { container, getByTestId } = render(<PracticeSearch />);

    fireEvent.change(getByTestId("practice-search-input"), {
      target: { value: invalidOdsCode },
    });
    fireEvent.click(getByTestId("practice-search-button"));

    expect(
      container.querySelector("#practice-search-input-error")
    ).toBeInTheDocument();
  });
});
