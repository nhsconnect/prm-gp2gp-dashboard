import React from "react";

import { render } from "@testing-library/react";

import SICBLDownloadData from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";

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

describe("SICBLDownloadData template", () => {
  const pipelineSICBLData = {
    sicblOdsCode: "12A",
    layout: "general",
    dataUpdatedDate: "2020-02-24 16:51:21.353977",
  };

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const sicblWithoutNameData = {
      sicblOdsCode: odsCode,
      layout: "general",
      dataUpdatedDate: "",
    };

    const { getByRole } = render(
      <SICBLDownloadData
        pageContext={sicblWithoutNameData}
        data={queryResult("", odsCode)}
      />
    );

    const expectedSICBLHeading = getByRole("heading", {
      name: "Y00159 download data",
      level: 1,
    });

    expect(expectedSICBLHeading).toBeInTheDocument();
  });

  it("renders Sub ICB Location name and ODS code title correctly", () => {
    const sicblHeadingText = "Burton ICB - 12A download data";

    const { getByRole } = render(
      <SICBLDownloadData pageContext={pipelineSICBLData} data={queryResult()} />
    );

    const expectedSICBLHeading = getByRole("heading", {
      name: sicblHeadingText,
      level: 1,
    });

    expect(expectedSICBLHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <SICBLDownloadData pageContext={pipelineSICBLData} data={queryResult()} />
    );

    const pageTitle = getByRole("heading", {
      name: "Download data",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <SICBLDownloadData pageContext={pipelineSICBLData} data={queryResult()} />
    );

    const pageDescription = getByText(
      /To download data for this Sub ICB Location in CSV format/
    );

    expect(pageDescription).toBeInTheDocument();
  });

  it("displays contents navigation", async () => {
    const { getByRole } = render(
      <SICBLDownloadData pageContext={pipelineSICBLData} data={queryResult()} />
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
