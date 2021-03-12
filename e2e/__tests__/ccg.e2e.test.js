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
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("bolton");
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
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(/.+/g);

        cy.contains("Successful integrations");
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains(/[\d]+/g);

        const validMetricAsPercentOrNA = /(.+%|n\/a)/;

        cy.contains("Within 3 days");
        cy.get('[data-testid="table__cell--row-0-col-2"]').contains(
          validMetricAsPercentOrNA
        );

        cy.contains("Within 8 days");
        cy.get('[data-testid="table__cell--row-0-col-3"]').contains(
          validMetricAsPercentOrNA
        );

        cy.contains("Beyond 8 days");
        cy.get('[data-testid="table__cell--row-0-col-4"]').contains(
          validMetricAsPercentOrNA
        );
        cy.checkAccessibility();

        // Navigate to Practice page
        cy.contains("td", /Practice|Centre/g)
          .first()
          .then($el => {
            const practiceName = $el.text();
            cy.contains(practiceName).click();

            const odsCode = practiceName.split("|")[1].trim();
            cy.url().should("include", `/${odsCode}`);
            cy.contains("h1", odsCode);
          });
      });

      it("searches and navigates to the CCG page and displays an error when it can't fetch the CCG data", () => {
        cy.intercept("GET", "https://directory.spineservices.nhs.uk/ORD", {
          statusCode: 400,
        });

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("bolton");
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
