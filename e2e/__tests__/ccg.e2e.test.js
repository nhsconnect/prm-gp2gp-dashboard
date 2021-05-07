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

      it("searches and navigates to the CCG page", () => {
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
        cy.contains("h1", "Test CCG With GP Practices10D");
        cy.contains("Why integrate within 8 days?").click();
        cy.contains("When records are not integrated within 8 days");
        cy.contains("Practice performance for December 2019");

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
      });

      it("sort practice performance table and link to the individual practices", () => {
        cy.intercept("GET", "/organisations", organisations);

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test ccg");
        cy.contains("li", "CCG")
          .parent()
          .parent()
          .click();
        cy.contains("button", "Search").click();

        cy.contains("h1", "Test CCG With GP Practices10D");

        cy.contains("Practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With Integrations | A12345"
        );
        cy.get('[data-testid="table__cell--row-1-col-0"]').contains(
          "Test GP Practice With Some Integrations | A12347"
        );
        cy.get('[data-testid="table__cell--row-2-col-0"]').contains(
          "Test GP Practice With No Integrations | A12346"
        );

        cy.contains("Sort by");
        cy.get("select#sortBySelect option:selected").should(
          "have.text",
          "Beyond 8 days"
        );

        cy.contains("Order");
        cy.get("select#orderSelect option:selected").should(
          "have.text",
          "Descending"
        );

        cy.get("select#sortBySelect").select("Practice name");
        cy.get("select#sortBySelect option:selected").should(
          "have.text",
          "Practice name"
        );

        cy.get("select#orderSelect").select("Ascending");
        cy.get("select#orderSelect option:selected").should(
          "have.text",
          "Ascending"
        );

        cy.contains("Practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With Integrations | A12345"
        );
        cy.get('[data-testid="table__cell--row-1-col-0"]').contains(
          "Test GP Practice With No Integrations | A12346"
        );
        cy.get('[data-testid="table__cell--row-2-col-0"]').contains(
          "Test GP Practice With Some Integrations | A12347"
        );

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
