const { viewPorts } = require("../support/common");
const { organisations } = require("/local-mocks/mocks.js");

describe("CCG page", () => {
  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches and navigates to the CCG page and then navigates to an individual practice page", () => {
        cy.intercept("GET", "/organisations", organisations);

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test ccg");
        cy.contains("li", "CCG")
          .parent()
          .parent()
          .click();
        cy.contains("button", "Search").click();

        // CCG Page
        cy.contains("Practice performance");

        cy.contains("Why integrate within 8 days?").click();
        cy.contains("When records are not integrated within 8 days");

        cy.contains("Practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With Integrations | A12345"
        );

        cy.contains("Successful integrations");
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains(3);

        cy.contains("Within 3 days");
        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("33.3%");

        cy.contains("Within 8 days");
        cy.get('[data-testid="table__cell--row-0-col-3"]').contains("33.3%");

        cy.contains("Beyond 8 days");
        cy.get('[data-testid="table__cell--row-0-col-4"]').contains("33.3%");
        cy.checkAccessibility();

        cy.contains("a", "Test GP Practice With Integrations | A12345")
          .should("have.attr", "href")
          .and("contains", "practice/A12345");
      });

      it("searches and navigates to the CCG page with no practices associated to that ccg", () => {
        cy.intercept("GET", "/organisations", {
          Organisations: [],
        });

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test ccg without");
        cy.contains("li", "CCG")
          .parent()
          .parent()
          .click();
        cy.contains("button", "Search").click();

        cy.contains("No GP practices found");
      });

      it("searches and navigates to the CCG page and displays an error when it can't fetch the CCG data", () => {
        cy.intercept("GET", "/organisations", {
          statusCode: 400,
        });

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test");
        cy.contains("li", "CCG")
          .parent()
          .parent()
          .click();
        cy.contains("button", "Search").click();

        cy.contains("Error loading practice list");
      });
    });
  });
});
