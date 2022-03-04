import React from "react";

import { render } from "@testing-library/react";

import CcgDownloadData from "../index";
import practiceMetricsMock from "../../../../../__mocks__/practiceMetricsMock.json";
import { when } from "jest-when";
import { mocked } from "ts-jest/utils";
import { useFeatureToggles } from "../../../../library/hooks/useFeatureToggle";

jest.mock("no-scroll");
jest.mock("../../../../library/hooks/useFeatureToggle");

describe("CCGDownloadData template - showContentsNavigation feature toggle is on", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
    layout: "general",
  };

  beforeEach(() => {
    when(mocked(useFeatureToggles))
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
      /To download data for this CCG in CSV format/
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

describe("CCGDownloadData template - showContentsNavigation feature toggle is off", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    ccgPractices: practiceMetricsMock,
    layout: "general",
  };

  beforeEach(() => {
    when(mocked(useFeatureToggles))
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

  it("doe not display contents navigation", async () => {
    const { queryByRole } = render(
      <CcgDownloadData pageContext={pipelineCCGData} />
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
