const { viewPorts } = require("../support/common");
const { practicesWithSomeIntegrations } = require("/local-mocks/mocks.js");

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
          practicesWithSomeIntegrations
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
        cy.contains("When records are not integrated within 8 days");

        cy.contains("Integration times for December 2019");

        cy.contains("Successful integrations");

        cy.get("[data-testid=table__cell--row-0-col-0]").contains(2);

        cy.contains("Integrated within 3 days");
        cy.get("[data-testid=table__cell--row-0-col-1]").contains("50%");

        cy.contains("Integrated within 8 days");
        cy.get("[data-testid=table__cell--row-0-col-2]").contains("50%");

        cy.contains("Integrated beyond 8 days");
        cy.get("[data-testid=table__cell--row-0-col-3]").contains("0%");

        cy.checkAccessibility();

        cy.contains(
          `[data-testid=back-to-search__${viewPort.device.toLowerCase()}]`,
          "Back to search"
        ).click();
        cy.contains("h1", "GP2GP patient record transfers data");
      });
    });
  });
});
