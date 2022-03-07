import React from "react";
import { getByRole, getByText, render } from "@testing-library/react";
import { DownloadData } from "../index";

describe("Download data component", () => {
  it("displays the title and description", () => {
    let pageDescription = "This is a description";
    const { getByText, getByRole } = render(
      <DownloadData formatData={() => ""} pageDescription={pageDescription} />
    );

    expect(getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(getByText(pageDescription)).toBeInTheDocument();
  });

  it("displays two radio components", () => {
    const { getByRole } = render(
      <DownloadData formatData={() => ""} pageDescription={""} />
    );
    let datasetType = getByRole("heading", {
      level: 3,
      name: "Which dataset would you like to download?",
    });
    let timeframe = getByRole("heading", {
      level: 3,
      name: "What timeframe would you like data for?",
    });
    expect(datasetType).toBeInTheDocument();
    expect(timeframe).toBeInTheDocument();
  });

  it("displays two radio components with correct options", () => {
    const { getByText } = render(
      <DownloadData formatData={() => ""} pageDescription={""} />
    );

    expect(getByText("Transfers requested")).toBeInTheDocument();
    expect(getByText("Integration times")).toBeInTheDocument();
    expect(getByText("All")).toBeInTheDocument();
    expect(getByText("Latest month")).toBeInTheDocument();
    expect(getByText("Last 6 months")).toBeInTheDocument();
  });

  it("displays a button with callback", () => {
    const callback = jest.fn();
    jest.mock("../../../library/utils/download/downloadFile", () => ({
      downloadFile: jest.fn(),
    }));

    // @ts-ignore
    window.URL.createObjectURL = function () {};

    const { getByRole } = render(
      <DownloadData formatData={callback} pageDescription={""} />
    );

    let button = getByRole("button");
    expect(button).toBeInTheDocument();

    button.click();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("downloads a file", () => {
    const formatData = jest.fn();
    const link = {
      dispatchEvent: jest.fn(),
      remove: jest.fn(),
    };

    const { getByRole } = render(
      <DownloadData formatData={formatData} pageDescription={""} />
    );

    global.URL.createObjectURL = jest.fn(() => "https://csv.test");
    global.URL.revokeObjectURL = jest.fn();
    // @ts-ignore
    global.Blob = function (content, options) {
      return { content, options };
    };
    // @ts-ignore
    jest.spyOn(document, "createElement").mockImplementation(() => link);

    let button = getByRole("button");
    button.click();

    expect(formatData).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(link.download).toBe("GP Registrations Data all-last-6-months.csv");
    // @ts-ignore
    expect(link.href).toBe("https://csv.test");
    expect(link.dispatchEvent).toHaveBeenCalledTimes(1);
  });
});
