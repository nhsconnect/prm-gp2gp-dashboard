import React from "react";
import { render } from "@testing-library/react";
import { OrganisationDetails } from "../";

describe("OrganisationDetails component", () => {
  it("displays organisation name and ODS code", () => {
    const name = "Hall Green Health";
    const odsCode = "Y00159";
    const { getByText } = render(
      <OrganisationDetails name={name} odsCode={odsCode} />
    );

    expect(getByText(name)).toBeInTheDocument();
    expect(getByText(odsCode)).toBeInTheDocument();
  });

  it("displays only organisation ODS code when the name is not provided", () => {
    const odsCode = "Y00159";
    const { getByText } = render(
      <OrganisationDetails name="" odsCode={odsCode} />
    );

    expect(getByText(odsCode)).toBeInTheDocument();
  });

  it("displays organisation address in the correct order", () => {
    const address = {
      lines: ["15", "Austhorpe Road", "Crossgates"],
      postCode: "LS15 8BA",
      town: "Leeds",
    };
    const testId = "organisation-details-address";
    const { getByTestId } = render(
      <OrganisationDetails name="" odsCode="" address={address} />
    );
    const addressNode = getByTestId(testId).children;

    expect(addressNode[0]).toHaveTextContent(address.lines[0]);
    expect(addressNode[1]).toHaveTextContent(address.lines[1]);
    expect(addressNode[2]).toHaveTextContent(address.lines[2]);
    expect(addressNode[3]).toHaveTextContent(address.town);
    expect(addressNode[4]).toHaveTextContent(address.postCode);
  });

  it("displays organisation address correctly with one address line", () => {
    const address = {
      lines: ["15 Austhorpe Road"],
      postCode: "LS15 8BA",
      town: "Leeds",
    };
    const testId = "organisation-details-address";
    const { getByText, getByTestId } = render(
      <OrganisationDetails name="" odsCode="" address={address} />
    );
    const addressNode = getByTestId(testId).children;

    expect(addressNode.length).toEqual(3);
    expect(getByText(address.lines[0])).toBeInTheDocument();
    expect(getByText(address.postCode)).toBeInTheDocument();
    expect(getByText(address.town)).toBeInTheDocument();
  });

  it("displays organisation post code and town if there are no address lines", () => {
    const address = {
      postCode: "LS15 8BA",
      town: "Leeds",
    };
    const testId = "organisation-details-address";
    const { getByText, getByTestId } = render(
      <OrganisationDetails name="" odsCode="" address={address} />
    );
    const addressNode = getByTestId(testId).children;

    expect(addressNode.length).toEqual(2);
    expect(getByText(address.postCode)).toBeInTheDocument();
    expect(getByText(address.town)).toBeInTheDocument();
  });
});
