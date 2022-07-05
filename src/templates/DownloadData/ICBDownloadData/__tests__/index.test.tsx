import React from "react";

import { render } from "@testing-library/react";

import ICBDownloadData from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";

jest.mock("no-scroll");

function queryResult(name: string = "BURTON ICB", odsCode: string = "12A") {
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

describe("ICBDownloadData template", () => {
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
      dataUpdatedDate: "",
    };

    const { getByRole } = render(
      <ICBDownloadData
        pageContext={icbWithoutNameData}
        data={queryResult("", odsCode)}
      />
    );

    const expectedICBHeading = getByRole("heading", {
      name: "Y00159 download data",
      level: 1,
    });

    expect(expectedICBHeading).toBeInTheDocument();
  });

  it("renders ICB name and ODS code title correctly", () => {
    const icbHeadingText = "Burton ICB - 12A download data";

    const { getByRole } = render(
      <ICBDownloadData pageContext={pipelineICBData} data={queryResult()} />
    );

    const expectedICBHeading = getByRole("heading", {
      name: icbHeadingText,
      level: 1,
    });

    expect(expectedICBHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <ICBDownloadData pageContext={pipelineICBData} data={queryResult()} />
    );

    const pageTitle = getByRole("heading", {
      name: "Download data",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <ICBDownloadData pageContext={pipelineICBData} data={queryResult()} />
    );

    const pageDescription = getByText(
      /To download data for this ICB in CSV format/
    );

    expect(pageDescription).toBeInTheDocument();
  });

  it("displays contents navigation", async () => {
    const { getByRole } = render(
      <ICBDownloadData pageContext={pipelineICBData} data={queryResult()} />
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
