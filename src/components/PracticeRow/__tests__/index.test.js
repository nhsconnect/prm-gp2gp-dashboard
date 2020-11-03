import React from "react";
import * as Gatsby from "gatsby";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PracticeRow from "../index";

describe("PracticeRow component", () => {
  it("navigates to a practice page when a link is clicked", async () => {
    const { getByRole } = render(
      <table>
        <tbody>
          <PracticeRow odsCode="A12345" name="A PRACTICE" />
        </tbody>
      </table>
    );

    const practicePageLink = getByRole("link", {
      name: "A Practice | A12345",
    });
    userEvent.click(practicePageLink);

    expect(Gatsby.Link).toHaveBeenCalledTimes(1);
    expect(Gatsby.Link).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/practice/A12345" }),
      expect.anything()
    );
  });
});
