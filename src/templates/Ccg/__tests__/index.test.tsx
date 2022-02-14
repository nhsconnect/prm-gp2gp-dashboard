import React from "react";
import { render } from "@testing-library/react";
import Ccg from "..";

jest.mock("no-scroll");

describe("CCG template", () => {
  const pipelineCCGData = {
    odsCode: "12A",
    name: "BURTON CCG",
    layout: "general",
  };

  it("displays redirect notice", () => {
    const { getByRole } = render(<Ccg pageContext={pipelineCCGData} />);

    const expectedRedirectTitle = getByRole("heading", {
      name: "This page has been moved.",
      level: 1,
    });
    expect(expectedRedirectTitle).toBeInTheDocument();

    const expectedRedirectLink = getByRole("link", {
      name: "Burton CCG - 12A integration times",
    });
    expect(expectedRedirectLink.getAttribute("href")).toBe(
      "/ccg/12A/integration-times"
    );
  });
});
