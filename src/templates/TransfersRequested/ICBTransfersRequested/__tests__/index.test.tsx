import React from "react";

import { findByLabelText, render, within } from "@testing-library/react";

import ICBTransfersRequested from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";

import userEvent from "@testing-library/user-event";

jest.mock("no-scroll");

function queryResult(
  name: string = "BURTON ICB - 12A",
  odsCode: string = "12A"
) {
  return {
    allFile: {
      edges: [
        {
          node: {
            childOrganisationsJson: {
              practices: practiceMetricsMock,
              icbs: [
                {
                  name: name,
                  odsCode: odsCode,
                },
              ],
            },
          },
        },
      ],
    },
  };
}

describe("ICB Transfers Requested template", () => {
  const pipelineICBData = {
    icbOdsCode: "12A",
    layout: "general",
    dataUpdatedDate: "2020-02-24 16:51:21.353977",
  };

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const icbWithoutNameData = {
      icbOdsCode: odsCode,
      layout: "general",
      dataUpdatedDate: "2020-02-24 16:51:21.353977",
    };

    const { getByRole } = render(
      <ICBTransfersRequested
        pageContext={icbWithoutNameData}
        data={queryResult("", odsCode)}
      />
    );

    const expectedICBHeading = getByRole("heading", {
      name: "Y00159 GP2GP transfers requested",
      level: 1,
    });

    expect(expectedICBHeading).toBeInTheDocument();
  });

  it("renders ICB name and ODS code title correctly", () => {
    const icbHeadingText = "Burton ICB - 12A GP2GP transfers requested";

    const { getByRole } = render(
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
    );

    const expectedICBHeading = getByRole("heading", {
      name: icbHeadingText,
      level: 1,
    });

    expect(expectedICBHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
    );

    const pageTitle = getByRole("heading", {
      name: "GP2GP transfers requested for registering practices",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders table caption correctly", () => {
    const { getByText } = render(
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
    );

    const tableCaption = getByText(
      "GP2GP transfers requested for registering practices - February 2020"
    );

    expect(tableCaption).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
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
    } = render(
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
    );

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
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
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
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
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

  it("displays ICB practices and hides about and definitions content", () => {
    const definitionsText =
      "Percentage of GP2GP transfers between the 1st and last day of the month that were successfully received by the registering practice.";

    const { getByText, queryByText, getAllByRole } = render(
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
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
      queryByText("This site is updated 15 days after the end of each month.", {
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
      <ICBTransfersRequested
        pageContext={pipelineICBData}
        data={queryResult()}
      />
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
