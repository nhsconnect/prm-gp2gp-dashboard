import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PageContent } from "../";
import {
  IntegrationsDefinitionsContent,
  WhyIntegrateWithin8Days,
} from "../../Definitions";

describe("PageContent component", () => {
  it("displays title when passed", () => {
    const titleText = "A title";

    const { getByRole } = render(
      <PageContent
        title={titleText}
        tableDescription=""
        tableContent=""
        expanderTitle=""
        expanderContent=""
        definitionsContent=""
        dataUpdatedDate=""
      />
    );

    const title = getByRole("heading", { name: titleText, level: 2 });
    expect(title).toBeInTheDocument();
  });

  it("displays the last edit date", () => {
    const dataUpdatedDate = "2020-04-24 16:51:21.353977";
    const expectedDate = /Data updated: April 2020/;

    const { getByText } = render(
      <PageContent
        title=""
        tableDescription=""
        tableContent=""
        expanderTitle=""
        expanderContent=""
        definitionsContent=""
        dataUpdatedDate={dataUpdatedDate}
      />
    );
    expect(getByText(expectedDate)).toBeInTheDocument();
  });

  it("displays table description", () => {
    const description = "table description";
    const { getByText } = render(
      <PageContent
        title=""
        tableDescription={description}
        tableContent=""
        expanderTitle=""
        expanderContent=""
        definitionsContent=""
        dataUpdatedDate=""
      />
    );

    const tableDescription = getByText(description);

    expect(tableDescription).toBeInTheDocument();
  });

  it("displays expander with the correct content", async () => {
    const { getByText, debug } = render(
      <PageContent
        title=""
        tableDescription=""
        tableContent=""
        expanderTitle="Why integrate within 8 days"
        expanderContent={<WhyIntegrateWithin8Days />}
        definitionsContent=""
        dataUpdatedDate=""
      />
    );

    const expanderTitle = getByText("Why integrate within 8 days");
    const expanderContent = getByText(
      "The previous practice will be automatically notified that the record",
      { exact: false }
    );
    expect(expanderTitle).toBeInTheDocument();
    expect(expanderContent).not.toBeVisible();

    userEvent.click(expanderTitle);

    await waitFor(() => {
      expect(expanderContent).toBeVisible();
    });
  });

  it("displays tab titles correctly", () => {
    const { getByRole } = render(
      <PageContent
        title=""
        tableDescription=""
        tableContent=""
        expanderTitle=""
        expanderContent=""
        definitionsContent=""
        dataUpdatedDate=""
      />
    );

    expect(
      getByRole("button", { name: "Click to display content Data table" })
    ).toBeInTheDocument();
    expect(
      getByRole("button", {
        name: "Click to display content Notes about this data",
      })
    ).toBeInTheDocument();
    expect(
      getByRole("button", { name: "Click to display content Definitions" })
    ).toBeInTheDocument();
  });

  it("displays data table content when passed", () => {
    const content = "A data table content";

    const { getByText } = render(
      <PageContent
        title=""
        tableDescription=""
        tableContent={content}
        expanderTitle=""
        expanderContent=""
        definitionsContent=""
        dataUpdatedDate=""
      />
    );

    expect(getByText(content)).toBeInTheDocument();
  });

  it("displays about this data when tab is clicked", async () => {
    const { getByRole, getByText, queryByText } = render(
      <PageContent
        title=""
        tableDescription=""
        tableContent=""
        expanderTitle=""
        expanderContent=""
        definitionsContent=""
        dataUpdatedDate=""
      />
    );

    const aboutTabContent = queryByText(
      "This site is updated 15 days after the end of each month.",
      { exact: false }
    );
    expect(aboutTabContent).not.toBeInTheDocument();

    const aboutTabTitle = getByRole("button", {
      name: "Click to display content Notes about this data",
    });
    userEvent.click(aboutTabTitle);

    await waitFor(() => {
      const aboutTabContent = getByText(
        "This site is updated 15 days after the end of each month.",
        { exact: false }
      );
      expect(aboutTabContent).toBeInTheDocument();

      const aboutHeading = getByRole("heading", {
        name: "How we calculate the data",
        level: 3,
      });
      expect(aboutHeading).toBeInTheDocument();
    });
  });

  it("displays definitions when tab is clicked", async () => {
    const { getByRole, getByText, queryByText } = render(
      <PageContent
        title=""
        tableDescription=""
        tableContent=""
        expanderTitle=""
        expanderContent=""
        definitionsContent={<IntegrationsDefinitionsContent />}
        dataUpdatedDate=""
      />
    );

    const definitionsText =
      "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent.";

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
