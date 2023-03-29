const { viewPorts } = require("../viewPorts");
const { practiceWithIntegrations } = require("../../local-mocks/mocks");

describe("Practice transfers requested page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        // cy.injectAxe();
        cy.visit("/");
      });

      it("searches, navigates to an individual practice integration times page, navigates to practice transfers requested page via contents menu and goes back to home page and goes back to home page", () => {
        cy.intercept(
          "/ORD/2-0-0/organisations/A12345",
          practiceWithIntegrations
        );

        cy.findByLabelText(
          "Enter an ODS code, practice name or Sub ICB Location name"
        )
          .type("Test GP Practice With Integrations A12345")
          .click();

        cy.contains("button", "Search").click({ force: true });

        cy.contains("h1", "Test GP Practice With Integrations - A12345");

        cy.contains("h2", "Contents");
        cy.contains("li", "Integration times");
        cy.contains("li", "GP2GP transfers requested").click();
        cy.contains("h2", "GP2GP transfers requested");

        cy.contains("li", "Integration times").click();
        cy.contains("Integration times for registering practice");
        cy.contains("li", "GP2GP transfers requested").click();
        cy.contains("h2", "GP2GP transfers requested");

        cy.title().should(
          "eq",
          "Test GP Practice With Integrations - A12345 - GP Registrations Data"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Monthly data about GP2GP transfers for this practice"
        );

        cy.contains("A12345");
        cy.contains("125 Some Address");
        cy.contains("Some Town");
        cy.contains("BL3 5DP");

        cy.contains("What happens when a GP2GP transfer fails?").click();
        cy.contains(
          "A task will automatically be created for the sending practice"
        );

        cy.get("[data-testid=gp2gp-table]").within(() => {
          cy.contains("Month");
          cy.get("[data-testid=table__cell--row-0-col-0]").contains(
            "December 2019"
          );

          cy.contains("GP2GP transfers requested");
          cy.get("[data-testid=table__cell--row-0-col-1]").contains(8);

          cy.contains("GP2GP transfers received");
          cy.get("[data-testid=table__cell--row-0-col-2]").contains("75%");

          cy.contains("GP2GP technical failures");
          cy.get("[data-testid=table__cell--row-0-col-3]").contains("25%");

          cy.get("[data-testid=table__cell--row-1-col-0]").contains(
            "November 2019"
          );
          cy.get("[data-testid=table__cell--row-1-col-1]").contains(1);
          cy.get("[data-testid=table__cell--row-1-col-2]").contains("100%");
          cy.get("[data-testid=table__cell--row-1-col-3]").contains("0%");
        });

        cy.get("[data-testid=gp2gp-open-modal-btn]")
          .filter(":visible")
          .eq(0)
          .click();
        cy.contains(
          "Total number of registrations that triggered a GP2GP transfer"
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
        cy.visit("/practice/A12345/gp2gp-transfers-requested");
        cy.contains("h1", "Test GP Practice With Integrations - A12345");

        cy.get("select#unitsSelect option:selected").should(
          "have.text",
          "Percentages"
        );

        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("75%");

        cy.get("select#unitsSelect")
          .scrollIntoView()
          .select("numbers", { force: true });

        cy.get("#table-title").click(); // click away to make sure select dropdown is updated

        cy.get("select#unitsSelect option:selected").should(
          "have.text",
          "Numbers"
        );

        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("6");
      });
    });
  });
});
