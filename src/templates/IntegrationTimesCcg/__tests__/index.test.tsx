import React from "react";

import { findByLabelText, render, within } from "@testing-library/react";

import IntegrationTimesCcg from "..";
import practiceMetricsMock from "../../../../__mocks__/practiceMetricsMock.json";

import userEvent from "@testing-library/user-event";

jest.mock("../../../library/hooks/useFeatureToggle");
jest.mock("no-scroll");

describe("CCG template", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
  };

  it("renders CCG details correctly", () => {
    const expectedPracticeName = "GP Practice - A12345";
    const expectedCCGHeading = "Burton CCG - 12A";

    const { getByText } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    expect(getByText(expectedCCGHeading)).toBeInTheDocument();
    expect(getByText(expectedPracticeName)).toBeInTheDocument();
  });

  it("renders table title correctly", () => {
    const { getByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const tableTitle = getByRole("heading", {
      name: "Integration times for February 2020",
      level: 2,
    });

    expect(tableTitle).toBeInTheDocument();
  });

  it("renders table description correctly", () => {
    const { getByText } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

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
    } = render(<IntegrationTimesCcg pageContext={pipelineCCGData} />);

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
    const { getAllByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

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
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const within8DaysHeader = getByRole("columnheader", {
      name: /Integrated within 8 days/,
    });

    const within8DaysHeaderButton =
      within(within8DaysHeader).getByRole("button");
    userEvent.click(within8DaysHeaderButton);

    const within8DaysModal = await findByLabelText("Integrated within 8 days");
    expect(within8DaysModal).toBeInTheDocument();
  });

  it("displays CCG practices and hides about and definitions content", () => {
    const definitionsText =
      "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent.";

    const { getByText, queryByText, getAllByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
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
      queryByText("This site is updated 14 days after the end of each month.", {
        exact: false,
      })
    ).not.toBeInTheDocument();

    expect(
      queryByText(definitionsText, {
        exact: false,
      })
    ).not.toBeInTheDocument();
  });
});
