import React from "react";

import { render } from "@testing-library/react";

import CcgDownloadData from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";

jest.mock("no-scroll");

function queryResult(name: string = "BURTON CCG", odsCode: string = "12A") {
  return {
    allFile: {
      edges: [
        {
          node: {
            childOrganisationsJson: {
              practices: practiceMetricsMock,
              ccgs: [
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

describe("CCGDownloadData template", () => {
  const pipelineCCGData = {
    ccgOdsCode: "12A",
    layout: "general",
    dataUpdatedDate: "2020-02-24 16:51:21.353977",
  };

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const ccgWithoutNameData = {
      ccgOdsCode: odsCode,
      layout: "general",
      dataUpdatedDate: "",
    };

    const { getByRole } = render(
      <CcgDownloadData
        pageContext={ccgWithoutNameData}
        data={queryResult("", odsCode)}
      />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: "Y00159 download data",
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders CCG name and ODS code title correctly", () => {
    const ccgHeadingText = "Burton CCG - 12A download data";

    const { getByRole } = render(
      <CcgDownloadData pageContext={pipelineCCGData} data={queryResult()} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: ccgHeadingText,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <CcgDownloadData pageContext={pipelineCCGData} data={queryResult()} />
    );

    const pageTitle = getByRole("heading", {
      name: "Download data",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <CcgDownloadData pageContext={pipelineCCGData} data={queryResult()} />
    );

    const pageDescription = getByText(
      /To download data for this CCG in CSV format/
    );

    expect(pageDescription).toBeInTheDocument();
  });

  it("displays contents navigation", async () => {
    const { getByRole } = render(
      <CcgDownloadData pageContext={pipelineCCGData} data={queryResult()} />
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
