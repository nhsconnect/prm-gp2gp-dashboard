const { viewPorts } = require("../support/common");
const { practiceWithSomeIntegrations } = require("/local-mocks/mocks.js");

describe("Practice page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches, navigates to an individual practice page and goes back to home page", () => {
        cy.intercept(
          "/ORD/2-0-0/organisations/A12347",
          practiceWithSomeIntegrations
        );

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("Test GP Practice With Some Integrations A12347");
        cy.contains("li", "Test GP Practice With Some Integrations")
          .parent()
          .parent()
          .click();

        cy.contains("button", "Search").click();

        cy.contains("h1", "Test GP Practice With Some Integrations - A12347");

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

        cy.contains("Integration times");

        cy.get("[data-testid=gp2gp-table]").within(() => {
          cy.contains("Month");
          cy.get("[data-testid=table__cell--row-0-col-0]").contains(
            "December 2019"
          );

          cy.contains("Transfers received");
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
        cy.contains("All GP2GP transfers that were requested by the practice");
        cy.contains("button", "Close").click();

        cy.contains("h2", "Notes about this data").should("not.exist");
        cy.contains("h2", "Definitions").should("not.exist");

        cy.contains("button", "Notes about this data").click();
        cy.contains("h2", "Notes about this data");
        cy.contains("December 2019").should("not.exist");
        cy.contains("h2", "Definitions").should("not.exist");

        cy.contains("button", "Definitions").click();
        cy.contains("h2", "Definitions");
        cy.contains("December 2019").should("not.exist");
        cy.contains("h2", "Notes about this data").should("not.exist");

        cy.contains("button", "Data table").click();
        cy.contains("December 2019");

        cy.checkAccessibility();

        cy.contains(
          `[data-testid=back-to-search__${viewPort.device.toLowerCase()}]`,
          "Back to search"
        ).click();
        cy.contains("h1", "GP2GP patient record transfers data");
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/practice/A12345");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
