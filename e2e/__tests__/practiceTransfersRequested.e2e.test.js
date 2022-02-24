const { viewPorts } = require("../support/common");
const { practiceWithSomeIntegrations } = require("/local-mocks/mocks.js");

describe("Practice transfers requested page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches, navigates to an individual practice integration times page, navigates to practice transfers requested page via contents menu and goes back to home page and goes back to home page", () => {
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
          cy.get("[data-testid=table__cell--row-0-col-1]").contains(3);

          cy.contains("GP2GP transfers received");
          cy.get("[data-testid=table__cell--row-0-col-2]").contains("66.7%");

          cy.contains("GP2GP technical failures");
          cy.get("[data-testid=table__cell--row-0-col-3]").contains("33.3%");

          cy.get("[data-testid=table__cell--row-1-col-0]").contains(
            "November 2019"
          );
          cy.get("[data-testid=table__cell--row-1-col-1]").contains(0);
          cy.get("[data-testid=table__cell--row-1-col-2]").contains("n/a");
          cy.get("[data-testid=table__cell--row-1-col-3]").contains("n/a");
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

        cy.checkAccessibility();

        cy.contains(
          `[data-testid=back-to-search__${viewPort.device.toLowerCase()}]`,
          "Back to search"
        ).click();
        cy.contains("h1", "GP2GP patient record transfers data");
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/practice/A12345/GP2GP-transfers-requested");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
