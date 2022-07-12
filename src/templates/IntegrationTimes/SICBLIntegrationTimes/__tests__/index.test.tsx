import React from "react";

import { findByLabelText, render, within } from "@testing-library/react";

import IntegrationTimesSICBL from "../index";
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
              sicbls: [
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
describe("SICBL Integration Times template", () => {
  const pipelineSICBLData = {
    sicblOdsCode: "12A",
    layout: "general",
    dataUpdatedDate: "2020-02-24 16:51:21.353977",
  };

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const sicblWithoutNameData = {
      dataUpdatedDate: "2020-02-24 16:51:21.353977",
      sicblOdsCode: odsCode,
      layout: "general",
    };

    const { getByRole } = render(
      <IntegrationTimesSICBL
        pageContext={sicblWithoutNameData}
        data={queryResult("", odsCode)}
      />
    );

    const expectedSICBLHeading = getByRole("heading", {
      name: "Y00159 integration times",
      level: 1,
    });

    expect(expectedSICBLHeading).toBeInTheDocument();
  });

  it("renders Sub ICB Location name and ODS code title correctly", () => {
    const sicblHeadingText = "Burton ICB - 12A integration times";

    const { getByRole } = render(
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
        data={queryResult()}
      />
    );

    const expectedSICBLHeading = getByRole("heading", {
      name: sicblHeadingText,
      level: 1,
    });

    expect(expectedSICBLHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
        data={queryResult()}
      />
    );

    const pageTitle = getByRole("heading", {
      name: "Integration times for registering practices",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders table caption correctly", () => {
    const { getByText } = render(
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
        data={queryResult()}
      />
    );

    const tableCaption = getByText(
      "Integration times for registering practices - February 2020"
    );

    expect(tableCaption).toBeInTheDocument();
  });

  it("renders table description correctly", () => {
    const { getByText } = render(
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
        data={queryResult()}
      />
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
    } = render(
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
        data={queryResult()}
      />
    );

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
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
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
    expect(
      within(allColumnHeaders[4]).getByRole("button", buttonOptions)
    ).toBeInTheDocument();
  });

  it("labels modal with content title", async () => {
    const { getByRole, findByLabelText } = render(
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
        data={queryResult()}
      />
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

  it("displays SICBL practices and hides about and definitions content", () => {
    const definitionsText =
      "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent.";

    const { getByText, queryByText, getAllByRole } = render(
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
        data={queryResult()}
      />
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
      <IntegrationTimesSICBL
        pageContext={pipelineSICBLData}
        data={queryResult()}
      />
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
