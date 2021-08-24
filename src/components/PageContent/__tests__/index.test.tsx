import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PageContent } from "../";

describe("PageContent component", () => {
  it("should display title when passed", () => {
    const titleText = "A title";

    const { getByRole } = render(
      <PageContent title={titleText} tableDescription="" />
    );

    const title = getByRole("heading", { name: titleText, level: 2 });

    expect(title).toBeInTheDocument();
  });

  it("should display table description", () => {
    const description = "table description";
    const { getByText } = render(
      <PageContent title="" tableDescription={description} />
    );

    const tableDescription = getByText(description);

    expect(tableDescription).toBeInTheDocument();
  });

  it("should display expander with the correct content", () => {
    const { getByText } = render(<PageContent title="" tableDescription="" />);

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
});
