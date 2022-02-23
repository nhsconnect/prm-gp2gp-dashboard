import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PracticeTableWithSort } from "../";
import { SortOrder } from "../index";
import practiceIntegrationMetricsPercentageMock from "../../../../__mocks__/practiceIntegrationMetricsPercentageMock.json";
import practiceTransfersRequestedMetricsPercentageMock from "../../../../__mocks__/practiceTransfersRequestedMetricsPercentageMock.json";
import practiceIntegrationSortOptions from "../../../data/content/practiceIntegrationsSortOptions.json";
import practiceTransfersRequestedSortOptions from "../../../data/content/practiceTransfersRequestedSortOptions.json";
import { PageTemplatePath } from "../../../library/enums/pageTemplatePath";

const integrationTableHeaders = [
  { title: "Requesting practice name " },
  { title: "GP2GP transfers received " },
  { title: "Integrated within 3 days " },
  { title: "Integrated within 8 days " },
  { title: "Not integrated within 8 days " },
];

const transfersRequestedTableHeaders = [
  { title: "Requesting practice name " },
  { title: "Registrations that triggered GP2GP transfer " },
  { title: "GP2GP transfers received " },
  { title: "GP2GP technical failures " },
];

describe("PracticeTableWithSort component", () => {
  it("should display table heading caption with the month and year", () => {
    const tableCaptionText =
      "Integration times for registering practices - February 2020";

    const { getByText } = render(
      <PracticeTableWithSort
        ccgPractices={practiceIntegrationMetricsPercentageMock}
        headers={integrationTableHeaders}
        sortBySelect={practiceIntegrationSortOptions.sortBySelect}
        orderSelect={practiceIntegrationSortOptions.orderSelect}
        tableCaption={tableCaptionText}
        pageTemplatePath={PageTemplatePath.IntegrationTimes}
      />
    );

    const tableCaption = getByText(`${tableCaptionText}`);

    expect(tableCaption).toBeInTheDocument();
  });

  it("should display correct table caption for transfers requested page path", () => {
    const tableCaptionText =
      "GP2GP transfers requested for registering practices - February 2020";

    const { getByText } = render(
      <PracticeTableWithSort
        ccgPractices={practiceTransfersRequestedMetricsPercentageMock}
        headers={transfersRequestedTableHeaders}
        sortBySelect={practiceTransfersRequestedSortOptions.sortBySelect}
        orderSelect={practiceTransfersRequestedSortOptions.orderSelect}
        tableCaption={tableCaptionText}
        pageTemplatePath={PageTemplatePath.TransferRequested}
      />
    );

    const tableCaption = getByText(`${tableCaptionText}`);

    expect(tableCaption).toBeInTheDocument();
  });

  it("displays practices ordered by GP2GP technical failures by default in descending order", () => {
    const { getAllByRole, getByRole } = render(
      <PracticeTableWithSort
        ccgPractices={practiceTransfersRequestedMetricsPercentageMock}
        headers={transfersRequestedTableHeaders}
        sortBySelect={practiceTransfersRequestedSortOptions.sortBySelect}
        orderSelect={practiceTransfersRequestedSortOptions.orderSelect}
        tableCaption={"Some title"}
        pageTemplatePath={PageTemplatePath.TransferRequested}
      />
    );

    const allRows = getAllByRole("row");

    const sortBySelect = getByRole("combobox", {
      name: `Sort by${practiceTransfersRequestedSortOptions.selectHiddenLabel}`,
    });
    const orderSelect = getByRole("combobox", {
      name: `Order${practiceTransfersRequestedSortOptions.selectHiddenLabel}`,
    });
    expect(sortBySelect).toHaveValue("failuresTotalPercentOfRequested");
    expect(orderSelect).toHaveValue(SortOrder.DESCENDING);

    expect(allRows[1]).toHaveTextContent("GP2GP technical failures 28.6%");
    expect(allRows[2]).toHaveTextContent("GP2GP technical failures 15%");
    expect(allRows[3]).toHaveTextContent("GP2GP technical failures 7.7%");
    expect(allRows[4]).toHaveTextContent("GP2GP technical failures 7.1%");
    expect(allRows[5]).toHaveTextContent("GP2GP technical failures 0%");
    expect(allRows[6]).toHaveTextContent("GP2GP technical failures n/a");
    expect(allRows.length).toBe(7);
  });

  it("displays practices ordered by Not integrated within 8 days Percentage SLA by default in descending order", () => {
    const { getAllByRole, getByRole } = render(
      <PracticeTableWithSort
        ccgPractices={practiceIntegrationMetricsPercentageMock}
        headers={integrationTableHeaders}
        sortBySelect={practiceIntegrationSortOptions.sortBySelect}
        orderSelect={practiceIntegrationSortOptions.orderSelect}
        tableCaption={"Some table title"}
        pageTemplatePath={PageTemplatePath.IntegrationTimes}
      />
    );

    const allRows = getAllByRole("row");

    const sortBySelect = getByRole("combobox", {
      name: `Sort by${practiceIntegrationSortOptions.selectHiddenLabel}`,
    });
    const orderSelect = getByRole("combobox", {
      name: `Order${practiceIntegrationSortOptions.selectHiddenLabel}`,
    });
    expect(sortBySelect).toHaveValue(
      "notIntegratedWithin8DaysPercentOfReceived"
    );
    expect(orderSelect).toHaveValue(SortOrder.DESCENDING);

    expect(allRows[1]).toHaveTextContent("Not integrated within 8 days 50%");
    expect(allRows[2]).toHaveTextContent("Not integrated within 8 days 25%");
    expect(allRows[3]).toHaveTextContent("Not integrated within 8 days 8.8%");
    expect(allRows[4]).toHaveTextContent("Not integrated within 8 days 7.7%");
    expect(allRows[5]).toHaveTextContent("Not integrated within 8 days 0%");
    expect(allRows[6]).toHaveTextContent("Not integrated within 8 days n/a");
    expect(allRows.length).toBe(7);
  });

  it("navigates to a practice page when a link is clicked", () => {
    const { getByRole } = render(
      <PracticeTableWithSort
        ccgPractices={practiceIntegrationMetricsPercentageMock}
        headers={integrationTableHeaders}
        sortBySelect={practiceIntegrationSortOptions.sortBySelect}
        orderSelect={practiceIntegrationSortOptions.orderSelect}
        tableCaption={"Some table title"}
        pageTemplatePath={PageTemplatePath.IntegrationTimes}
      />
    );

    const practicePageLink = getByRole("link", {
      name: "GP Practice - A12345",
    });

    expect(practicePageLink.getAttribute("href")).toBe(
      "/practice/A12345/integration-times"
    );
  });

  describe("Sorting practice table", () => {
    const cases = [
      [
        "Requesting practice name",
        "requestingPracticeName",
        SortOrder.DESCENDING,
        [
          "Requesting practice name Third GP Practice - A12347",
          "Requesting practice name Sixth GP Practice - A12350",
          "Requesting practice name Second GP Practice - A12346",
        ],
      ],
      [
        "Requesting practice name",
        "requestingPracticeName",
        SortOrder.ASCENDING,
        [
          "Requesting practice name Fifth GP Practice - A12349",
          "Requesting practice name Fourth GP Practice - A12348",
          "Requesting practice name GP Practice - A12345",
        ],
      ],
      [
        "GP2GP transfers received",
        "receivedCount",
        SortOrder.DESCENDING,
        [
          "GP2GP transfers received 34",
          "GP2GP transfers received 22",
          "GP2GP transfers received 13",
        ],
      ],
      [
        "GP2GP transfers received",
        "receivedCount",
        SortOrder.ASCENDING,
        [
          "GP2GP transfers received 0",
          "GP2GP transfers received 5",
          "GP2GP transfers received 12",
        ],
      ],
      [
        "Integrated within 3 days",
        "integratedWithin3DaysPercentOfReceived",
        SortOrder.DESCENDING,
        [
          "Integrated within 3 days 60%",
          "Integrated within 3 days 58.8%",
          "Integrated within 3 days 41.7%",
        ],
      ],
      [
        "Integrated within 3 days",
        "integratedWithin3DaysPercentOfReceived",
        SortOrder.ASCENDING,
        [
          "Integrated within 3 days n/a",
          "Integrated within 3 days 0%",
          "Integrated within 3 days 22.7%",
        ],
      ],
      [
        "Integrated within 8 days",
        "integratedWithin8DaysPercentOfReceived",
        SortOrder.DESCENDING,
        [
          "Integrated within 8 days 92.3%",
          "Integrated within 8 days 40%",
          "Integrated within 8 days 33.3%",
        ],
      ],
      [
        "Integrated within 8 days",
        "integratedWithin8DaysPercentOfReceived",
        SortOrder.ASCENDING,
        [
          "Integrated within 8 days n/a",
          "Integrated within 8 days 27.3%",
          "Integrated within 8 days 32.4%",
        ],
      ],
      [
        "Not integrated within 8 days",
        "notIntegratedWithin8DaysPercentOfReceived",
        SortOrder.DESCENDING,
        [
          "Not integrated within 8 days 50%",
          "Not integrated within 8 days 25%",
          "Not integrated within 8 days 8.8%",
        ],
      ],
      [
        "Not integrated within 8 days",
        "notIntegratedWithin8DaysPercentOfReceived",
        SortOrder.ASCENDING,
        [
          "Not integrated within 8 days n/a",
          "Not integrated within 8 days 0%",
          "Not integrated within 8 days 7.7%",
        ],
      ],
    ];

    it.each(cases)(
      "displays practices ordered by %p field and %p %p order when selected",
      (columnHeader, fieldName, order, expectedSortOrder) => {
        const { getAllByRole, getByRole, queryAllByRole } = render(
          <PracticeTableWithSort
            ccgPractices={practiceIntegrationMetricsPercentageMock}
            headers={integrationTableHeaders}
            sortBySelect={practiceIntegrationSortOptions.sortBySelect}
            orderSelect={practiceIntegrationSortOptions.orderSelect}
            tableCaption={"Some table title"}
            pageTemplatePath={PageTemplatePath.IntegrationTimes}
          />
        );

        const allRows = getAllByRole("row");

        const sortBySelect = getByRole("combobox", {
          name: `Sort by${practiceIntegrationSortOptions.selectHiddenLabel}`,
        });
        const orderSelect = getByRole("combobox", {
          name: `Order${practiceIntegrationSortOptions.selectHiddenLabel}`,
        });

        userEvent.selectOptions(sortBySelect, fieldName);
        userEvent.selectOptions(orderSelect, order);

        expect(sortBySelect).toHaveValue(fieldName);
        expect(orderSelect).toHaveValue(order);

        (expectedSortOrder as string[]).forEach((cell, index) => {
          const sortedCell = queryAllByRole("cell", {
            name: cell,
          });

          const sortedRowheader = queryAllByRole("rowheader");

          const expectedSortedCell = sortedCell[0] || sortedRowheader[index];

          expect(expectedSortedCell).toHaveClass("sorted");
        });

        const sortedColumnHeader = getByRole("columnheader", {
          name: columnHeader as string,
        });
        expect(sortedColumnHeader.getAttribute("aria-sort")).toBe(order);

        expect(allRows[1]).toHaveTextContent(expectedSortOrder[0]);
        expect(allRows[2]).toHaveTextContent(expectedSortOrder[1]);
        expect(allRows[3]).toHaveTextContent(expectedSortOrder[2]);
        expect(allRows.length).toBe(7);
      }
    );
  });
});
