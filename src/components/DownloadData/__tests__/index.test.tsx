import React from "react";
import { getByRole, getByText, render } from "@testing-library/react";
import { DownloadData } from "../index";

describe("Download data component", () => {
  it("displays the title and description", () => {
    let pageDescription = "This is a description";
    const { getByText, getByRole } = render(
      <DownloadData callback={() => {}} pageDescription={pageDescription} />
    );

    expect(getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(getByText(pageDescription)).toBeInTheDocument();
  });

  it("displays two radio components", () => {
    const { getByRole } = render(
      <DownloadData callback={() => {}} pageDescription={""} />
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
      <DownloadData callback={() => {}} pageDescription={""} />
    );

    expect(getByText("Transfers requested")).toBeInTheDocument();
    expect(getByText("Integration times")).toBeInTheDocument();
    expect(getByText("All")).toBeInTheDocument();
    expect(getByText("Latest month")).toBeInTheDocument();
    expect(getByText("Last 6 months")).toBeInTheDocument();
  });

  it("displays a button with callback", () => {
    const callback = jest.fn();
    const { getByRole } = render(
      <DownloadData callback={callback} pageDescription={""} />
    );

    let button = getByRole("button");
    expect(button).toBeInTheDocument();

    button.click();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
