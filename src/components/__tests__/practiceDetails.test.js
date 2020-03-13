import React from "react";
import { render } from "@testing-library/react";
import PracticeDetails from "../PracticeDetails/index";

describe("PracticeDetails component", () => {
  it("displays practice name and ODS code", () => {
    const name = "Hall Green Health";
    const odsCode = "Y00159";
    const { getByText } = render(
      <PracticeDetails name={name} odsCode={odsCode} />
    );

    expect(getByText(name)).toBeInTheDocument();
    expect(getByText(odsCode)).toBeInTheDocument();
  });

  it("displays only practice ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const { getByText } = render(<PracticeDetails odsCode={odsCode} />);

    expect(getByText(odsCode)).toBeInTheDocument();
  });

  it("displays practice address in the correct order", () => {
    const address = {
      lines: ["15", "Austhorpe Road", "Crossgates"],
      postCode: "LS15 8BA",
      town: "Leeds",
    };
    const testId = "practice-details-address";
    const { getByTestId } = render(<PracticeDetails address={address} />);
    const addressNode = getByTestId(testId).children;

    expect(addressNode[0]).toHaveTextContent(address.lines[0]);
    expect(addressNode[1]).toHaveTextContent(address.lines[1]);
    expect(addressNode[2]).toHaveTextContent(address.lines[2]);
    expect(addressNode[3]).toHaveTextContent(address.town);
    expect(addressNode[4]).toHaveTextContent(address.postCode);
  });

  it("displays practice address correctly with one address line", () => {
    const address = {
      lines: ["15 Austhorpe Road"],
      postCode: "LS15 8BA",
      town: "Leeds",
    };
    const testId = "practice-details-address";
    const { getByText, getByTestId } = render(
      <PracticeDetails address={address} />
    );
    const addressNode = getByTestId(testId).children;

    expect(addressNode.length).toEqual(3);
    expect(getByText(address.lines[0])).toBeInTheDocument();
    expect(getByText(address.postCode)).toBeInTheDocument();
    expect(getByText(address.town)).toBeInTheDocument();
  });

  it("displays practice post code and town if there are no address lines", () => {
    const address = {
      postCode: "LS15 8BA",
      town: "Leeds",
    };
    const testId = "practice-details-address";
    const { getByText, getByTestId } = render(
      <PracticeDetails address={address} />
    );
    const addressNode = getByTestId(testId).children;

    expect(addressNode.length).toEqual(2);
    expect(getByText(address.postCode)).toBeInTheDocument();
    expect(getByText(address.town)).toBeInTheDocument();
  });
});
