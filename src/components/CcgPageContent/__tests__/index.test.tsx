import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mocked } from "ts-jest/utils";
import { when } from "jest-when";

import { CcgPageContent } from "../";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";
import { useFeatureToggles } from "../../../library/hooks/useFeatureToggle";

jest.mock("../../../library/hooks/useFeatureToggle");

describe("CcgPageContent component", () => {
  const definitionsText =
    "The percentage of successful integrations that were integrated (filed or suppressed) within 3 days of the record being sent.";

  describe("With Tabs", () => {
    beforeEach(() => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ showTabsView: true });
    });

    const ccgPractices = [
      ...practiceMetricsMock,
      {
        odsCode: "B12345",
        name: "GP Practice 2",
        metrics: [
          {
            year: 2020,
            month: 1,
            requester: {
              integrated: {
                transferCount: 7,
                within3Days: 0,
                within8Days: 2,
                beyond8Days: 5,
                within3DaysPercentage: 0,
                within8DaysPercentage: 28.6,
                beyond8DaysPercentage: 71.4,
              },
            },
          },
        ],
      },
    ];

    it("displays tab titles correctly", () => {
      const { getByRole } = render(
        <CcgPageContent ccgPractices={ccgPractices} />
      );

      expect(getByRole("button", { name: "Data table" })).toBeInTheDocument();
      expect(getByRole("button", { name: "About" })).toBeInTheDocument();
      expect(getByRole("button", { name: "Definitions" })).toBeInTheDocument();
    });

    it("displays CCG practices and hides about and definitions content", () => {
      const { getByText, queryByText, getAllByRole } = render(
        <CcgPageContent ccgPractices={ccgPractices} />
      );

      const allRows = getAllByRole("row");

      expect(getByText("GP Practice - A12345")).toBeInTheDocument();
      expect(getByText("GP Practice 2 - B12345")).toBeInTheDocument();
      expect(allRows[1]).toHaveTextContent("Successful integrations 7");
      expect(allRows[1]).toHaveTextContent("Integrated within 3 days 0%");
      expect(allRows[1]).toHaveTextContent("Integrated within 8 days 28.6%");
      expect(allRows[1]).toHaveTextContent("Integrated beyond 8 days 71.4%");

      expect(
        queryByText(
          "The Data Platform is updated 14 days after the end of the month.",
          { exact: false }
        )
      ).not.toBeInTheDocument();

      expect(
        queryByText(definitionsText, {
          exact: false,
        })
      ).not.toBeInTheDocument();
    });

    it("displays about this data when tab is clicked", async () => {
      const { getByRole, getByText, queryByText } = render(
        <CcgPageContent ccgPractices={ccgPractices} />
      );

      const aboutTabContent = queryByText(
        "The Data Platform is updated 14 days after the end of the month.",
        { exact: false }
      );
      expect(aboutTabContent).not.toBeInTheDocument();

      const aboutTabTitle = getByRole("button", { name: "About" });
      userEvent.click(aboutTabTitle);

      await waitFor(() => {
        const aboutTabContent = getByText(
          "The Data Platform is updated 14 days after the end of the month.",
          { exact: false }
        );
        expect(aboutTabContent).toBeInTheDocument();
      });
    });

    it("displays definitions when tab is clicked", async () => {
      const { getByRole, getByText, queryByText } = render(
        <CcgPageContent ccgPractices={ccgPractices} />
      );

      const definitionsTabContent = queryByText(definitionsText, {
        exact: false,
      });
      expect(definitionsTabContent).not.toBeInTheDocument();

      const definitionsTabTitle = getByRole("button", { name: "Definitions" });
      userEvent.click(definitionsTabTitle);

      await waitFor(() => {
        const definitionsTabContent = getByText(definitionsText, {
          exact: false,
        });
        expect(definitionsTabContent).toBeInTheDocument();
      });
    });
  });

  describe("Without Tabs - showTabsView toggled off", () => {
    beforeEach(() => {
      when(mocked(useFeatureToggles))
        .calledWith()
        .mockReturnValue({ showTabsView: false });
    });

    it("displays CCG 'About this data' header correctly - when showTabsView toggled off", () => {
      const { getByRole } = render(
        <CcgPageContent ccgPractices={practiceMetricsMock} />
      );

      const aboutThisDataHeading = getByRole("heading", {
        name: "About this data",
        level: 2,
      });

      expect(aboutThisDataHeading).toBeInTheDocument();
    });

    it("displays multiple CCG practices - when showTabsView toggled off", () => {
      const ccgPractices = [
        ...practiceMetricsMock,
        {
          odsCode: "B12345",
          name: "GP Practice 2",
          metrics: [
            {
              year: 2020,
              month: 1,
              requester: {
                integrated: {
                  transferCount: 7,
                  within3Days: 0,
                  within8Days: 2,
                  beyond8Days: 5,
                  within3DaysPercentage: 0,
                  within8DaysPercentage: 28.6,
                  beyond8DaysPercentage: 71.4,
                },
              },
            },
          ],
        },
      ];

      const { getByText, getAllByRole } = render(
        <CcgPageContent ccgPractices={ccgPractices} />
      );

      const allRows = getAllByRole("row");

      expect(getByText("GP Practice - A12345")).toBeInTheDocument();
      expect(getByText("GP Practice 2 - B12345")).toBeInTheDocument();
      expect(allRows[1]).toHaveTextContent("Successful integrations 7");
      expect(allRows[1]).toHaveTextContent("Integrated within 3 days 0%");
      expect(allRows[1]).toHaveTextContent("Integrated within 8 days 28.6%");
      expect(allRows[1]).toHaveTextContent("Integrated beyond 8 days 71.4%");
    });

    it("should display expander with the correct content - when showTabsView toggled off", () => {
      const { getByText } = render(
        <CcgPageContent ccgPractices={practiceMetricsMock} />
      );

      const expanderTitle = getByText("Why integrate within 8 days");
      const expanderContent = getByText(
        "This increases burden on both the sending and receiving",
        { exact: false }
      );
      expect(expanderTitle).toBeInTheDocument();
      expect(expanderContent).not.toBeVisible();

      userEvent.click(expanderTitle);
      expect(expanderContent).toBeVisible();
    });
  });
});
