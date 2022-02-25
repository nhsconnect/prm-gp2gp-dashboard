import React from "react";

import { findByLabelText, render, within } from "@testing-library/react";

import CcgTransfersRequested from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";

import userEvent from "@testing-library/user-event";

jest.mock("no-scroll");

describe("CCG Transfers Requested template", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
    layout: "general",
  };

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const ccgWithoutNameData = {
      odsCode,
      name: "",
      ccgPractices: practiceMetricsMock,
      layout: "general",
    };

    const { getByRole } = render(
      <CcgTransfersRequested pageContext={ccgWithoutNameData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: odsCode,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders CCG name and ODS code title correctly", () => {
    const ccgHeadingText = "Burton CCG - 12A";

    const { getByRole } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: ccgHeadingText,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const pageTitle = getByRole("heading", {
      name: "GP2GP transfers requested for registering practices",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders table caption correctly", () => {
    const { getByText } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const tableCaption = getByText(
      "GP2GP transfers requested for registering practices - February 2020"
    );

    expect(tableCaption).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const tableDescription = getByText(
      "number of registrations that triggered a GP2GP transfer",
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
    } = render(<CcgTransfersRequested pageContext={pipelineCCGData} />);

    expect(
      queryByText(
        /GP2GP transfers requested between the 1st and last day of the month that failed for a technical reason/
      )
    ).not.toBeInTheDocument();
    expect(
      queryAllByText(/and should be reported to the system supplier/)
    ).toHaveLength(1);

    const transfersReceivedHeader = getByRole("columnheader", {
      name: /GP2GP technical failures/,
    });

    const transfersReceivedModalButton = within(
      transfersReceivedHeader
    ).getByRole("button");
    userEvent.click(transfersReceivedModalButton);

    expect(
      await findByText(
        /GP2GP transfers requested between the 1st and last day of the month that failed for a technical reason/
      )
    ).toBeInTheDocument();
    expect(
      await findAllByText(/and should be reported to the system supplier/)
    ).toHaveLength(2);
  });

  it("displays help icons for all relevant headers", () => {
    const { getAllByRole } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
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
  });

  it("labels modal with content title", async () => {
    const { getByRole, findByLabelText } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const transfersReceivedHeader = getByRole("columnheader", {
      name: /GP2GP transfers received/,
    });

    const transfersReceivedHeaderButton = within(
      transfersReceivedHeader
    ).getByRole("button");
    userEvent.click(transfersReceivedHeaderButton);

    const within8DaysModal = await findByLabelText("GP2GP transfers received");
    expect(within8DaysModal).toBeInTheDocument();
  });

  it("displays CCG practices and hides about and definitions content", () => {
    const definitionsText =
      "Percentage of GP2GP transfers between the 1st and last day of the month that were successfully received by the registering practice.";

    const { getByText, queryByText, getAllByRole } = render(
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const allRows = getAllByRole("row");

    expect(getByText("GP Practice - A12345")).toBeInTheDocument();
    expect(getByText("Second GP Practice - A12346")).toBeInTheDocument();
    expect(allRows[1]).toHaveTextContent(
      /Registrations that triggered GP2GP transfer(.*)7/
    );
    expect(allRows[1]).toHaveTextContent(/GP2GP transfers received(.*)71.42%/);
    expect(allRows[1]).toHaveTextContent(/GP2GP technical failures(.*)28.6%/);

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
      <CcgTransfersRequested pageContext={pipelineCCGData} />
    );

    const contentsHeader = getByRole("heading", {
      name: "Contents",
      level: 2,
    });

    const contentsLink = getByRole("link", {
      name: "Integration times",
    });

    expect(contentsHeader).toBeInTheDocument();
    expect(contentsLink).toBeInTheDocument();
  });
});
