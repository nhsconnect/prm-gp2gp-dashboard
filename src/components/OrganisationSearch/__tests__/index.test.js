import React from "react";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrganisationSearch } from "../";
import { waitFor } from "@testing-library/dom";

describe("OrganisationSearch component", () => {
  const validPracticeOdsCode = "A12345";
  const validPracticeName = "Test Practice";
  const inputLabelText =
    "Enter an ODS code, practice name or Sub ICB Location name";
  const validSICBLOdsCode = "12A";

  beforeAll(() => {
    const useStaticQuery = jest.spyOn(Gatsby, "useStaticQuery");
    useStaticQuery.mockImplementation(() => ({
      allFile: {
        edges: [
          {
            node: {
              childOrganisationsJson: {
                practices: [
                  { odsCode: "A12345", name: "Test Practice" },
                  { odsCode: "X99999", name: "Second Practice" },
                ],
                sicbls: [
                  { odsCode: "12A", name: "Test ICB - 12A" },
                  { odsCode: "13B", name: "Second ICB - 13B" },
                ],
              },
            },
          },
        ],
      },
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("navigation to practice page", () => {
    it("when searching for and selecting an ods code", async () => {
      const { getByLabelText, getByText, getByRole } = render(
        <OrganisationSearch />
      );

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, "A123");

      const suggestion = getByText("Test Practice -");
      userEvent.click(suggestion);

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);
      await waitFor(() => {
        expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
        expect(Gatsby.navigate).toHaveBeenCalledWith(
          `/practice/${validPracticeOdsCode}/integration-times`
        );
      });
    });

    it("on existing practice name input", async () => {
      const { getByLabelText, getByText, getByRole } = render(
        <OrganisationSearch />
      );

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, validPracticeName);

      const suggestion = getByText(`- ${validPracticeOdsCode}`);
      userEvent.click(suggestion);

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);
      await waitFor(() => {
        expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
        expect(Gatsby.navigate).toHaveBeenCalledWith(
          `/practice/${validPracticeOdsCode}/integration-times`
        );
      });
    });

    it("when typing valid ods code and not selecting", async () => {
      const { getByLabelText, getByRole } = render(<OrganisationSearch />);

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, validPracticeOdsCode);

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);

      await waitFor(() => {
        expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
        expect(Gatsby.navigate).toHaveBeenCalledWith(
          `/practice/${validPracticeOdsCode}/integration-times`
        );
      });
    });

    it("entering partial search with one result", async () => {
      const { getByLabelText, getByRole } = render(<OrganisationSearch />);

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, "A12");

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);
      await waitFor(() => {
        expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
        expect(Gatsby.navigate).toHaveBeenCalledWith(
          `/practice/${validPracticeOdsCode}/integration-times`
        );
      });
    });
  });

  describe("navigation to SICBL page", () => {
    it("when searching for and selecting an ods code", async () => {
      const { getByLabelText, getByText, getByRole } = render(
        <OrganisationSearch />
      );

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, validSICBLOdsCode);

      expect(getByText("12A")).toBeInTheDocument(); // expect to appear only once - from the name and not odsCode
      const suggestion = getByText("Test ICB", { exact: false });
      userEvent.click(suggestion);

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);
      await waitFor(() => {
        expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
        expect(Gatsby.navigate).toHaveBeenCalledWith(
          `/sub-ICB-location/${validSICBLOdsCode}/integration-times`
        );
      });
    });

    it("when typing valid ods code and not selecting", async () => {
      const { getByLabelText, getByRole } = render(<OrganisationSearch />);

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, validSICBLOdsCode);

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);

      await waitFor(() => {
        expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
        expect(Gatsby.navigate).toHaveBeenCalledWith(
          `/sub-ICB-location/${validSICBLOdsCode}/integration-times`
        );
      });
    });

    it("entering partial search with one result", async () => {
      const { getByLabelText, getByRole } = render(<OrganisationSearch />);

      const input = getByLabelText(inputLabelText);
      await userEvent.type(input, "13");

      const submitButton = getByRole("button", { name: "Search" });
      userEvent.click(submitButton);

      await waitFor(() => {
        expect(Gatsby.navigate).toHaveBeenCalledTimes(1);
        expect(Gatsby.navigate).toHaveBeenCalledWith(
          "/sub-ICB-location/13B/integration-times"
        );
      });
    });
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

    await waitFor(() => {
      expect(
        getByText(
          "Please enter a valid ODS code, practice name or Sub ICB Location name"
        )
      ).toBeInTheDocument();
      expect(Gatsby.navigate).toHaveBeenCalledTimes(0);
    });
  });

  it("displays an error on invalid ODS code input", async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <OrganisationSearch />
    );

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, "B00000");

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        getByText(
          "Please enter a valid ODS code, practice name or Sub ICB Location name"
        )
      ).toBeInTheDocument();
      expect(Gatsby.navigate).toHaveBeenCalledTimes(0);
    });
  });

  it("displays an error when search returns multiple results", async () => {
    const { getByLabelText, getByText, getByRole } = render(
      <OrganisationSearch />
    );

    const input = getByLabelText(inputLabelText);
    await userEvent.type(input, "Practice");

    const submitButton = getByRole("button", { name: "Search" });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        getByText(
          "Multiple results matching 'Practice'. Please select an option from the dropdown."
        )
      ).toBeInTheDocument();
      expect(Gatsby.navigate).toHaveBeenCalledTimes(0);
    });
  });
});
