import React from "react";

import { findByLabelText, render, within } from "@testing-library/react";

import IntegrationTimesCcg from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";

import userEvent from "@testing-library/user-event";
import { when } from "jest-when";
import { useFeatureToggles } from "../../../../library/hooks/useFeatureToggle";

jest.mock("no-scroll");
jest.mock("../../../../library/hooks/useFeatureToggle");

describe("CCG Integration Times template - showContentsNavigation feature toggle is on", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
    layout: "general",
  };

  beforeEach(() => {
    when(jest.mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showContentsNavigation: true });
  });

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const ccgWithoutNameData = {
      odsCode,
      name: "",
      ccgPractices: practiceMetricsMock,
      layout: "general",
    };

    const { getByRole } = render(
      <IntegrationTimesCcg pageContext={ccgWithoutNameData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: "Y00159 integration times",
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders CCG name and ODS code title correctly", () => {
    const ccgHeadingText = "Burton CCG - 12A integration times";

    const { getByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: ccgHeadingText,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const pageTitle = getByRole("heading", {
      name: "Integration times for registering practices",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders table caption correctly", () => {
    const { getByText } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const tableCaption = getByText(
      "Integration times for registering practices - February 2020"
    );

    expect(tableCaption).toBeInTheDocument();
  });

  it("renders table description correctly", () => {
    const { getByText } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const tableDescription = getByText(
      "The table below shows the integration times for GP2GP transfers received.",
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
    expect(allRows[1]).toHaveTextContent(/GP2GP transfers received(.*)22/);
    expect(allRows[1]).toHaveTextContent(/Integrated within 3 days(.*)22.7%/);
    expect(allRows[1]).toHaveTextContent(/Integrated within 8 days(.*)27.3%/);
    expect(allRows[1]).toHaveTextContent(
      /Not integrated within 8 days \(paper copy requested\)(.*)50%/
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

  it("displays contents navigation", async () => {
    const { getByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const contentsHeader = getByRole("heading", {
      name: "Contents",
      level: 2,
    });

    const contentsLink = getByRole("link", {
      name: "GP2GP transfers requested",
    });

    expect(contentsHeader).toBeInTheDocument();
    expect(contentsLink).toBeInTheDocument();
  });
});

describe("CCG Integration Times template - showContentsNavigation feature toggle is off", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
    layout: "general",
  };

  beforeEach(() => {
    when(jest.mocked(useFeatureToggles))
      .calledWith()
      .mockReturnValue({ showContentsNavigation: false });
  });

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const ccgWithoutNameData = {
      odsCode,
      name: "",
      ccgPractices: practiceMetricsMock,
      layout: "general",
    };

    const { getByRole } = render(
      <IntegrationTimesCcg pageContext={ccgWithoutNameData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: `${odsCode} integration times`,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders CCG name and ODS code title correctly", () => {
    const ccgHeadingText = "Burton CCG - 12A integration times";

    const { getByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: ccgHeadingText,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const pageTitle = getByRole("heading", {
      name: "Integration times for registering practices",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders table caption correctly", () => {
    const { getByText } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const tableCaption = getByText(
      "Integration times for registering practices - February 2020"
    );

    expect(tableCaption).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const tableDescription = getByText(
      "The table below shows the integration times for GP2GP transfers received.",
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
    expect(allRows[1]).toHaveTextContent(/GP2GP transfers received(.*)22/);
    expect(allRows[1]).toHaveTextContent(/Integrated within 3 days(.*)22.7%/);
    expect(allRows[1]).toHaveTextContent(/Integrated within 8 days(.*)27.3%/);
    expect(allRows[1]).toHaveTextContent(
      /Not integrated within 8 days \(paper copy requested\)(.*)50%/
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

  it("does not display contents navigation", () => {
    const { queryByRole } = render(
      <IntegrationTimesCcg pageContext={pipelineCCGData} />
    );

    const contentsHeader = queryByRole("heading", {
      name: "Contents",
      level: 2,
    });
    const contentsLink = queryByRole("link", {
      name: "GP2GP transfers requested",
    });

    expect(contentsHeader).not.toBeInTheDocument();
    expect(contentsLink).not.toBeInTheDocument();
  });
});
