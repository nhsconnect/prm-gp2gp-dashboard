import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PageContent } from "../";

describe("PageContent component", () => {
  const definitionsText =
    "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent.";

  it("displays title when passed", () => {
    const titleText = "A title";

    const { getByRole } = render(
      <PageContent title={titleText} tableDescription="" tableContent="" />
    );

    const title = getByRole("heading", { name: titleText, level: 2 });

    expect(title).toBeInTheDocument();
  });

  it("displays table description", () => {
    const description = "table description";
    const { getByText } = render(
      <PageContent title="" tableDescription={description} tableContent="" />
    );

    const tableDescription = getByText(description);

    expect(tableDescription).toBeInTheDocument();
  });

  it("displays expander with the correct content", () => {
    const { getByText } = render(
      <PageContent title="" tableDescription="" tableContent="" />
    );

    const expanderTitle = getByText("Why integrate within 8 days");
    const expanderContent = getByText(
      "This increases burden on both the sending and receiving",
      { exact: false }
    );
    expect(expanderTitle).toBeInTheDocument();
    expect(expanderContent).not.toBeVisible();

    userEvent.click(expanderTitle);
    expect(expanderContent).toBeVisible();
  });

  it("displays tab titles correctly", () => {
    const { getByRole } = render(
      <PageContent title="" tableDescription="" tableContent="" />
    );

    expect(
      getByRole("button", { name: "Click to display content Data table" })
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Click to display content About" })
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Click to display content Definitions" })
    ).toBeInTheDocument();
  });

  it("displays data table content when passed", () => {
    const content = "A data table content";

    const { getByText } = render(
      <PageContent title="" tableDescription="" tableContent={content} />
    );

    expect(getByText(content)).toBeInTheDocument();
  });

  it("displays about this data when tab is clicked", async () => {
    const { getByRole, getByText, queryByText } = render(
      <PageContent title="" tableDescription="" tableContent="" />
    );

    const aboutTabContent = queryByText(
      "This site is updated 14 days after the end of each month.",
      { exact: false }
    );
    expect(aboutTabContent).not.toBeInTheDocument();

    const aboutTabTitle = getByRole("button", {
      name: "Click to display content About",
    });
    userEvent.click(aboutTabTitle);

    await waitFor(() => {
      const aboutTabContent = getByText(
        "This site is updated 14 days after the end of each month.",
        { exact: false }
      );
      expect(aboutTabContent).toBeInTheDocument();

      const aboutHeading = getByRole("heading", {
        name: "About this data",
        level: 2,
      });
      expect(aboutHeading).toBeInTheDocument();
    });
  });

  it("displays definitions when tab is clicked", async () => {
    const { getByRole, getByText, queryByText } = render(
      <PageContent title="" tableDescription="" tableContent="" />
    );

    const definitionsTabContent = queryByText(definitionsText, {
      exact: false,
    });
    expect(definitionsTabContent).not.toBeInTheDocument();

    const definitionsTabTitle = getByRole("button", {
      name: "Click to display content Definitions",
    });
    userEvent.click(definitionsTabTitle);

    await waitFor(() => {
      const definitionsTabContent = getByText(definitionsText, {
        exact: false,
      });
      expect(definitionsTabContent).toBeInTheDocument();

      const definitionsHeading = getByRole("heading", {
        name: "Definitions",
        level: 2,
      });
      expect(definitionsHeading).toBeInTheDocument();
    });
  });
});
