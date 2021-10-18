import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Tabs } from "..";
import userEvent from "@testing-library/user-event";

describe("Tabs component", () => {
  const tabs = [
    { title: "First tab", content: "This is a paragraph" },
    { title: "Second tab", content: <div>A div</div> },
    { title: "third tab", content: "" },
  ];

  it("displays tab titles", () => {
    const { getAllByRole } = render(<Tabs tabs={tabs} />);

    const [firstButton, secondButton, thirdButton] = getAllByRole("button");

    expect(firstButton).toBeInTheDocument();
    expect(secondButton).toBeInTheDocument();
    expect(thirdButton).toBeInTheDocument();
  });

  it("displays first tab content by default", () => {
    const { getByText } = render(<Tabs tabs={tabs} />);

    const firstTabContent = getByText("This is a paragraph");

    expect(firstTabContent).toBeInTheDocument();
  });

  it("displays second tab content when second title clicked", async () => {
    const { queryByText, getByRole, getByText } = render(<Tabs tabs={tabs} />);

    const firstTabContent = getByText("This is a paragraph");
    expect(firstTabContent).toBeInTheDocument();

    const secondTabContent = queryByText("A div");
    expect(secondTabContent).not.toBeInTheDocument();

    const secondTabTitle = getByRole("button", {
      name: "Click to display content Second tab",
    });
    userEvent.click(secondTabTitle);

    await waitFor(() => {
      const firstTabContent = queryByText("This is a paragraph");
      expect(firstTabContent).not.toBeInTheDocument();

      const secondTabContent = getByText("A div");
      expect(secondTabContent).toBeInTheDocument();
    });
  });

  it("has gp2gp-active-tab class name when tab is selected", async () => {
    const { getByRole } = render(<Tabs tabs={tabs} />);

    const firstTabTitle = getByRole("button", {
      name: "Click to display content First tab",
    });
    expect(firstTabTitle).toHaveClass("gp2gp-tabs__tab-title--active");

    const secondTabTitle = getByRole("button", {
      name: "Click to display content Second tab",
    });
    expect(secondTabTitle).not.toHaveClass("gp2gp-tabs__tab-title--active");

    userEvent.click(secondTabTitle);

    await waitFor(() => {
      expect(secondTabTitle).toHaveClass("gp2gp-tabs__tab-title--active");
      expect(firstTabTitle).not.toHaveClass("gp2gp-tabs__tab-title--active");
    });
  });
});
