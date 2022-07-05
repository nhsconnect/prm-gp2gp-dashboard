import React from "react";
import { getByRole, getByText, render } from "@testing-library/react";
import { DownloadData } from "../index";
import {
  DatasetTypeOptions,
  TimeframeOptions,
} from "../../../library/enums/datasetTypeOptions";

describe("Download data component", () => {
  it("displays the title and description", () => {
    const pageDescription = "This is a description";
    const { getByText, getByRole } = render(
      <DownloadData
        data={[]}
        pageDescription={pageDescription}
        dataFor="Test GP practice"
        dataUpdatedDate=""
      />
    );

    expect(getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(getByText(pageDescription)).toBeInTheDocument();
  });

  it("contains a link to definition and details about this data", () => {
    const { getByRole } = render(
      <DownloadData
        data={[]}
        pageDescription=""
        dataFor="Test GP practice"
        dataUpdatedDate=""
      />
    );

    const definitionsAndNotesAboutThisDataLink = getByRole("link", {
      name: "Definitions and notes about this data (opens in a new tab)",
    });
    expect(definitionsAndNotesAboutThisDataLink).toBeInTheDocument();
    expect(definitionsAndNotesAboutThisDataLink.getAttribute("href")).toBe(
      "/definitions-and-notes-about-this-data"
    );
    expect(definitionsAndNotesAboutThisDataLink.getAttribute("target")).toBe(
      "_blank"
    );
    expect(definitionsAndNotesAboutThisDataLink.getAttribute("rel")).toBe(
      "noopener noreferrer"
    );
  });

  it("displays the last edit date", () => {
    const dataUpdatedDate = "2020-04-24 16:51:21.353977";
    const expectedDate = /Data updated: April 2020/;
    const { getByText } = render(
      <DownloadData
        data={[]}
        pageDescription=""
        dataFor="Test GP practice"
        dataUpdatedDate={dataUpdatedDate}
      />
    );
    expect(getByText(expectedDate)).toBeInTheDocument();
  });

  it("displays two radio components", () => {
    const { getByRole } = render(
      <DownloadData
        data={[]}
        pageDescription={""}
        dataFor="Test GP ICB"
        dataUpdatedDate=""
      />
    );
    const datasetType = getByRole("heading", {
      level: 3,
      name: "Which dataset would you like to download?",
    });
    const timeframe = getByRole("heading", {
      level: 3,
      name: "What timeframe would you like data for?",
    });
    expect(datasetType).toBeInTheDocument();
    expect(timeframe).toBeInTheDocument();
  });

  it("displays two radio components with correct labels", () => {
    const { getByLabelText } = render(
      <DownloadData
        data={[]}
        pageDescription=""
        dataFor="Test GP practice"
        dataUpdatedDate=""
      />
    );

    expect(getByLabelText("Transfers requested")).toBeInTheDocument();
    expect(getByLabelText("Integration times")).toBeInTheDocument();
    expect(getByLabelText("All")).toBeInTheDocument();
    expect(getByLabelText("Latest month")).toBeInTheDocument();
    expect(getByLabelText("Last 6 months")).toBeInTheDocument();
  });

  it("displays a button that can be clicked", () => {
    jest.mock("../../../library/utils/download/downloadFile", () => ({
      downloadFile: jest.fn(),
    }));

    // @ts-ignore
    window.URL.createObjectURL = function () {};

    const { getByRole } = render(
      <DownloadData
        data={[]}
        pageDescription=""
        dataFor="Test GP ICB"
        dataUpdatedDate=""
      />
    );

    const button = getByRole("button", {
      name: "Download",
    });
    expect(button).toBeInTheDocument();

    button.click();
  });

  it("downloads a file", () => {
    const formatData = jest.fn();
    const link = {
      dispatchEvent: jest.fn(),
      remove: jest.fn(),
    };

    const { getByRole } = render(
      <DownloadData
        data={[]}
        pageDescription=""
        dataFor="Test GP practice"
        dataUpdatedDate=""
      />
    );

    global.URL.createObjectURL = jest.fn(() => "https://csv.test");
    global.URL.revokeObjectURL = jest.fn();
    // @ts-ignore
    global.Blob = function (content, options) {
      return { content, options };
    };
    // @ts-ignore
    jest.spyOn(document, "createElement").mockImplementation(() => link);

    const button = getByRole("button", {
      name: "Download",
    });
    button.click();

    // @ts-ignore
    expect(link.download).toBe(
      "GP Registrations Data Test GP practice " +
        `${DatasetTypeOptions.AllMetrics}-${TimeframeOptions.Last6Months}.csv`
    );
    // @ts-ignore
    expect(link.href).toBe("https://csv.test");
    expect(link.dispatchEvent).toHaveBeenCalledTimes(1);
  });
});
