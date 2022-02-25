import React from "react";

import { render } from "@testing-library/react";

import CcgDownloadData from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";

jest.mock("no-scroll");

describe("CCG Download Data template", () => {
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
      <CcgDownloadData pageContext={ccgWithoutNameData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: /Y00159/,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders CCG name and ODS code title correctly", () => {
    const ccgHeadingText = /Burton CCG - 12A/;

    const { getByRole } = render(
      <CcgDownloadData pageContext={pipelineCCGData} />
    );

    const expectedCcgHeading = getByRole("heading", {
      name: ccgHeadingText,
      level: 1,
    });

    expect(expectedCcgHeading).toBeInTheDocument();
  });

  it("renders page title correctly", () => {
    const { getByRole } = render(
      <CcgDownloadData pageContext={pipelineCCGData} />
    );

    const pageTitle = getByRole("heading", {
      name: "Download data",
      level: 2,
    });

    expect(pageTitle).toBeInTheDocument();
  });

  it("renders page description correctly", () => {
    const { getByText } = render(
      <CcgDownloadData pageContext={pipelineCCGData} />
    );

    const pageDescription = getByText(
      "To download data for this CCG in CSV format",
      { exact: false }
    );

    expect(pageDescription).toBeInTheDocument();
  });

  it("displays contents navigation", async () => {
    const { getByRole } = render(
      <CcgDownloadData pageContext={pipelineCCGData} />
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
