import React from "react";
import { render } from "@testing-library/react";
import { ContentsList } from "../";

describe("ContentsList component", () => {
  it("displays an h2 of 'Contents'", () => {
    const { getByRole } = render(<ContentsList />);
    const contentsTitle = getByRole("heading", { name: "Contents", level: 2 });
    expect(contentsTitle).toBeInTheDocument();
  });

  it("displays content list link and text when passed", () => {
    const contentsList = [
      {
        text: "This is a link",
        href: "/link",
      },
    ];
    const { getByRole } = render(<ContentsList items={contentsList} />);

    const contentsLink = getByRole("link", {
      name: "This is a link",
    });
    expect(contentsLink).toBeInTheDocument();
    expect(contentsLink.getAttribute("href")).toBe("/link");
  });

  it("only displays links for contents items that has href", () => {
    const contentsList = [
      {
        text: "This will not be linked",
      },
      {
        text: "This is a link",
        href: "/another-link",
      },
    ];
    const { queryByRole, getByText } = render(
      <ContentsList items={contentsList} />
    );

    const contentsLink = queryByRole("link", {
      name: "This is a link",
    });
    expect(contentsLink).toBeInTheDocument();
    expect(contentsLink).toHaveAttribute("href");
    expect(contentsLink?.getAttribute("href")).toBe("/another-link");

    const notLink = getByText("This will not be linked");
    expect(notLink).toBeInTheDocument();
    expect(notLink).not.toHaveAttribute("href");
  });
});
