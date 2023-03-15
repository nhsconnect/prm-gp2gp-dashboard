const { viewPorts } = require("../viewPorts");
const { practiceWithSomeIntegrations } = require("/local-mocks/mocks.js");

describe("Practice Integration Times page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.intercept(
          "/ORD/2-0-0/organisations/A12347",
          practiceWithSomeIntegrations
        );
        // cy.injectAxe();
        cy.visit("/");
      });

      it("searches, navigates to an individual practice integration times page and goes back to home page", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Sub ICB Location name"
        )
          .type("Test GP Practice With Some Integrations A12347")
          .click();

        cy.contains("button", "Search").click({ force: true });

        cy.contains("h1", "Test GP Practice With Some Integrations - A12347");

        cy.contains("h2", "Contents");
        cy.contains("li", "Integration times");

        cy.title().should(
          "eq",
          "Test GP Practice With Some Integrations - A12347 - GP Registrations Data"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Monthly data about GP2GP transfers for this practice"
        );

        cy.contains("A12347");
        cy.contains("123 Some Address");
        cy.contains("Some Town");
        cy.contains("BL3 5DP");

        cy.contains("Why integrate within 8 days").click();
        cy.contains("If transfers are not integrated within 8 days");

        cy.contains("h2", "Integration times");

        cy.get("[data-testid=gp2gp-table]").within(() => {
          cy.contains("Month");
          cy.get("[data-testid=table__cell--row-0-col-0]").contains(
            "December 2019"
          );

          cy.contains("GP2GP transfers received");
          cy.get("[data-testid=table__cell--row-0-col-1]").contains(2);

          cy.contains("Integrated within 3 days");
          cy.get("[data-testid=table__cell--row-0-col-2]").contains("50%");

          cy.contains("Integrated within 8 days");
          cy.get("[data-testid=table__cell--row-0-col-3]").contains("50%");

          cy.contains("Not integrated within 8 days");
          cy.get("[data-testid=table__cell--row-0-col-4]").contains("0%");

          cy.get("[data-testid=table__cell--row-1-col-0]").contains(
            "November 2019"
          );
          cy.get("[data-testid=table__cell--row-1-col-1]").contains(0);
          cy.get("[data-testid=table__cell--row-1-col-2]").contains("n/a");
          cy.get("[data-testid=table__cell--row-1-col-3]").contains("n/a");
          cy.get("[data-testid=table__cell--row-1-col-4]").contains("n/a");
        });

        cy.get("[data-testid=gp2gp-open-modal-btn]")
          .filter(":visible")
          .eq(0)
          .click();
        cy.contains(
          "Total number of GP2GP transfers between the 1st and last day of the month"
        );
        cy.contains("button", "Close").click();

        cy.contains("h3", "How we calculate the data").should("not.exist");
        cy.contains("h2", "Definitions").should("not.exist");

        cy.contains("button", "Notes about this data").click();
        cy.contains("h3", "How we calculate the data");
        cy.contains("December 2019").should("not.exist");
        cy.contains("h2", "Definitions").should("not.exist");

        cy.contains("button", "Definitions").click();
        cy.contains("h2", "Definitions");
        cy.contains("December 2019").should("not.exist");
        cy.contains("h2", "Notes about this data").should("not.exist");

        cy.contains("button", "Data table").click();
        cy.contains("December 2019");

        cy.contains("Data updated: February 2020");

        // cy.checkAccessibility()

        cy.contains(
          `[data-testid=back-to-search__${viewPort.device.toLowerCase()}]`,
          "Back to search"
        ).click();
        cy.contains("h1", "GP2GP patient record transfers data");
      });

      it("display percentages on practice performance table, change to numbers when selected", () => {
        cy.visit("/practice/A12347/integration-times");
        cy.contains("h1", "Test GP Practice With Some Integrations - A12347");

        cy.get("select#unitsSelect option:selected").should(
          "have.text",
          "Percentages"
        );

        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("50%");

        cy.get("select#unitsSelect").scrollIntoView().select("Numbers", { force: true });

        cy.get("select#unitsSelect option:selected").should(
          "have.text",
          "Numbers"
        );

        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("1");
      });
    });
  });
});
