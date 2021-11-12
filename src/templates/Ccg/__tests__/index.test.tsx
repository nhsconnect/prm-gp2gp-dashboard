import React from "react";

import { findByLabelText, render, within } from "@testing-library/react";

import Ccg from "..";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

import { mocked } from "ts-jest/utils";
import { when } from "jest-when";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";
import userEvent from "@testing-library/user-event";

jest.mock("../../../library/hooks/useFeatureToggle");
jest.mock("no-scroll");

describe("CCG template", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
  };

  describe("showDefinitionsModals toggled on", () => {
    beforeEach(() => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ showDefinitionsModals: true });
    });

    it("renders CCG details correctly", () => {
      const expectedPracticeName = "GP Practice - A12345";
      const expectedCCGHeading = "Burton CCG - 12A";

      const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

      expect(getByText(expectedCCGHeading)).toBeInTheDocument();
      expect(getByText(expectedPracticeName)).toBeInTheDocument();
    });

    it("renders table title correctly", () => {
      const { getByRole } = render(<Ccg pageContext={pipelineCCGData} />);

      const tableTitle = getByRole("heading", {
        name: "Integration times for February 2020",
        level: 2,
      });

      expect(tableTitle).toBeInTheDocument();
    });

    it("renders table description correctly", () => {
      const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

      const tableDescription = getByText(
        "Records that take longer than 24 hours to transfer electronically via GP2GP are excluded ",
        { exact: false }
      );

      expect(tableDescription).toBeInTheDocument();
    });

    it("displays modal with definitions when icon is clicked", async () => {
      const {
        findByText,
        findAllByText,
        queryByText,
        queryAllByText,
        getByRole,
      } = render(<Ccg pageContext={pipelineCCGData} />);

      expect(
        queryByText(/transfers received that were not integrated within 8 days/)
      ).not.toBeInTheDocument();
      expect(
        queryAllByText(/Unnecessary printing causes avoidable work/)
      ).toHaveLength(1);

      const transfersReceivedHeader = getByRole("columnheader", {
        name: /Not integrated within 8 days/,
      });

      const transfersReceivedModalButton = within(
        transfersReceivedHeader
      ).getByRole("button");
      userEvent.click(transfersReceivedModalButton);

      expect(
        await findByText(
          /transfers received that were not integrated within 8 days/
        )
      ).toBeInTheDocument();
      expect(
        await findAllByText(/Unnecessary printing causes avoidable work/)
      ).toHaveLength(2);
    });

    it("displays help icons for all relevant headers", () => {
      const { getAllByRole } = render(<Ccg pageContext={pipelineCCGData} />);

      const allColumnHeaders = getAllByRole("columnheader");

      const buttonOptions = { name: "Open modal with definition" };

      expect(
        within(allColumnHeaders[0]).queryByRole("button", buttonOptions)
      ).not.toBeInTheDocument();
      expect(
        within(allColumnHeaders[1]).getByRole("button", buttonOptions)
      ).toBeInTheDocument();
      expect(
        within(allColumnHeaders[2]).getByRole("button", buttonOptions)
      ).toBeInTheDocument();
      expect(
        within(allColumnHeaders[3]).getByRole("button", buttonOptions)
      ).toBeInTheDocument();
      expect(
        within(allColumnHeaders[4]).getByRole("button", buttonOptions)
      ).toBeInTheDocument();
    });

    it("labels modal with content title", async () => {
      const { getByRole, findByLabelText } = render(
        <Ccg pageContext={pipelineCCGData} />
      );

      const within8DaysHeader = getByRole("columnheader", {
        name: /Integrated within 8 days/,
      });

      const within8DaysHeaderButton =
        within(within8DaysHeader).getByRole("button");
      userEvent.click(within8DaysHeaderButton);

      const within8DaysModal = await findByLabelText(
        "Integrated within 8 days"
      );
      expect(within8DaysModal).toBeInTheDocument();
    });

    it("displays CCG practices and hides about and definitions content", () => {
      const definitionsText =
        "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent.";

      const { getByText, queryByText, getAllByRole } = render(
        <Ccg pageContext={pipelineCCGData} />
      );

      const allRows = getAllByRole("row");

      expect(getByText("GP Practice - A12345")).toBeInTheDocument();
      expect(getByText("Second GP Practice - A12346")).toBeInTheDocument();
      expect(allRows[1]).toHaveTextContent(/Transfers received(.*)22/);
      expect(allRows[1]).toHaveTextContent(/Integrated within 3 days(.*)22.7%/);
      expect(allRows[1]).toHaveTextContent(/Integrated within 8 days(.*)27.3%/);
      expect(allRows[1]).toHaveTextContent(
        /Not integrated within 8 days \(paper copy sent\)(.*)50%/
      );

      expect(
        queryByText(
          "This site is updated 14 days after the end of each month.",
          {
            exact: false,
          }
        )
      ).not.toBeInTheDocument();

      expect(
        queryByText(definitionsText, {
          exact: false,
        })
      ).not.toBeInTheDocument();
    });
  });

  describe("showDefinitionsModals toggled off", () => {
    beforeEach(() => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ showDefinitionsModals: false });
    });

    it("renders table title correctly", () => {
      const { getByRole } = render(<Ccg pageContext={pipelineCCGData} />);

      const tableTitle = getByRole("heading", {
        name: "Integration times for February 2020",
        level: 2,
      });

      expect(tableTitle).toBeInTheDocument();
    });

    it("renders table description correctly", () => {
      const { getByText } = render(<Ccg pageContext={pipelineCCGData} />);

      const tableDescription = getByText(
        "Records that take longer than 24 hours to transfer electronically via GP2GP are excluded ",
        { exact: false }
      );

      expect(tableDescription).toBeInTheDocument();
    });

    it("Does not display help icons for headers", () => {
      const { getAllByRole } = render(<Ccg pageContext={pipelineCCGData} />);

      const allColumnHeaders = getAllByRole("columnheader");

      allColumnHeaders.forEach((columnHeader) => {
        expect(
          within(columnHeader).queryByRole("button", {
            name: "Open modal with definition",
          })
        ).not.toBeInTheDocument();
      });
    });

    it("displays CCG practices and hides about and definitions content", () => {
      const definitionsText =
        "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent.";

      const { getByText, queryByText, getAllByRole } = render(
        <Ccg pageContext={pipelineCCGData} />
      );

      const allRows = getAllByRole("row");

      expect(getByText("GP Practice - A12345")).toBeInTheDocument();
      expect(getByText("Second GP Practice - A12346")).toBeInTheDocument();
      expect(allRows[1]).toHaveTextContent("Transfers received 22");
      expect(allRows[1]).toHaveTextContent("Integrated within 3 days 22.7%");
      expect(allRows[1]).toHaveTextContent("Integrated within 8 days 27.3%");
      expect(allRows[1]).toHaveTextContent(
        "Not integrated within 8 days (paper copy sent) 50%"
      );

      expect(
        queryByText(
          "This site is updated 14 days after the end of each month.",
          {
            exact: false,
          }
        )
      ).not.toBeInTheDocument();

      expect(
        queryByText(definitionsText, {
          exact: false,
        })
      ).not.toBeInTheDocument();
    });
  });
});
