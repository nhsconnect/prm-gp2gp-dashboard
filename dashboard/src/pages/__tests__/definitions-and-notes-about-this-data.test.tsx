import React from "react";
import { render } from "@testing-library/react";
import DefinitionsAndNotesAboutThisData from "../definitions-and-notes-about-this-data";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";

describe("<DefinitionsAndNotes/>", () => {
  it("displays all contents correctly", async () => {
    const { getByRole, getByText, getAllByText } = render(
      <DefinitionsAndNotesAboutThisData />
    );

    expect(
      getByRole("heading", {
        name: "Definitions and notes about this data",
        level: 1,
      })
    ).toBeInTheDocument();

    expect(
      getByRole("heading", {
        name: "Definitions",
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      getByRole("heading", {
        name: "About this data",
        level: 2,
      })
    ).toBeInTheDocument();

    expect(
      getByRole("heading", {
        name: "How we calculate the data",
        level: 3,
      })
    ).toBeInTheDocument();

    expect(
      getByRole("heading", {
        name: "Not included in the data",
        level: 3,
      })
    ).toBeInTheDocument();

    expect(
      getByText(
        "Total number of registrations that triggered a GP2GP transfer between the 1st and the last day of the month."
      )
    ).not.toBeVisible();
    userEvent.click(
      getAllByText("Registrations that triggered GP2GP transfer")[0]
    );

    await waitFor(() => {
      expect(
        getByText(
          "Total number of registrations that triggered a GP2GP transfer between the 1st and the last day of the month."
        )
      ).toBeVisible();

      expect(
        getByText(
          "Total number of GP2GP transfers between the 1st and last day of the month that were successfully received by the registering practice."
        )
      ).not.toBeVisible();
    });

    userEvent.click(getAllByText("GP2GP transfers received")[0]);

    await waitFor(() => {
      expect(
        getByText(
          "Total number of GP2GP transfers between the 1st and last day of the month that were successfully received by the registering practice."
        )
      ).toBeVisible();

      expect(
        getByText(
          "Percentage of GP2GP transfers requested between the 1st and last day of the month that failed for a technical reason."
        )
      ).not.toBeVisible();
    });

    userEvent.click(
      getAllByText("GP2GP technical failures (paper copy requested)")[0]
    );

    await waitFor(() => {
      expect(
        getByText(
          "Percentage of GP2GP transfers requested between the 1st and last day of the month that failed for a technical reason."
        )
      ).toBeVisible();

      expect(
        getByText(
          "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent."
        )
      ).not.toBeVisible();
    });

    userEvent.click(getAllByText("Integrated within 3 days")[0]);

    await waitFor(() => {
      expect(
        getByText(
          "The percentage of transfers received that were integrated (filed or suppressed) within 3 days of the record being sent."
        )
      ).toBeVisible();

      expect(
        getByText(
          "The percentage of transfers received that were integrated (filed or suppressed) within 8 days of the record being sent."
        )
      ).not.toBeVisible();
    });

    userEvent.click(getAllByText("Integrated within 8 days")[0]);

    await waitFor(() => {
      expect(
        getByText(
          "The percentage of transfers received that were integrated (filed or suppressed) within 8 days of the record being sent."
        )
      ).toBeVisible();
      expect(
        getByText(
          "The percentage of transfers received that were not integrated within 8 days."
        )
      ).not.toBeVisible();
    });
    userEvent.click(
      getAllByText("Not integrated within 8 days (paper copy requested)")[0]
    );

    await waitFor(() => {
      expect(
        getByText(
          "The percentage of transfers received that were not integrated within 8 days."
        )
      ).toBeVisible();

      expect(
        getByText("This site is updated 15 days after the end of each month.", {
          exact: false,
        })
      ).toBeInTheDocument();
      expect(
        getByText("GP2GP transfers for deducting practices")
      ).toBeInTheDocument();
    });
  });
});
