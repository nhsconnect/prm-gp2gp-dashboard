const { viewPorts } = require("../support/common");

describe("CCG page", () => {
  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches and navigates to the CCG page and then navigates to an individual practice page", () => {
        cy.intercept(
          "GET",
          "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?RelTypeId=RE4&TargetOrgId=10D&RelStatus=active&Limit=1000",
          { fixture: "ccgPractices.json" }
        );

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

        // Navigate to Practice page
        cy.contains("a", "Test GP Practice With Integrations | A12345").click();
        cy.url().should("include", "practice/A12345");
        cy.contains("h1", "Test GP Practice With Integrations");
        cy.contains("h1", "A12345");
      });

      it("searches and navigates to the CCG page with no practices associated to that ccg", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test ccg without");
        cy.contains("li", "CCG")
          .parent()
          .parent()
          .click();
        cy.contains("button", "Search").click();

        // CCG Page
        cy.contains("No GP practices found");
      });

      it("searches and navigates to the CCG page and displays an error when it can't fetch the CCG data", () => {
        cy.intercept("GET", "https://directory.spineservices.nhs.uk/ORD", {
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

        // CCG Page
        cy.contains("Error loading practice list");
      });
    });
  });
});
