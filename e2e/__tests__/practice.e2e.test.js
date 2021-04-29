const { viewPorts } = require("../support/common");

describe("Practice page", () => {
  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches, navigates to an individual practice page and goes back to home page", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("Bolton Community Practice");
        cy.contains("li", "Bolton Community Practice")
          .parent()
          .parent()
          .click();

        cy.contains("button", "Search").click();

        //TODO: Make data agnostic
        cy.contains("h1", "Bolton Community Practice");
        cy.contains("Y03079");
        cy.contains("Waters Meeting Health Centre");
        cy.contains("Waters Meeting Road");
        cy.contains("Bolton");
        cy.contains("BL1 8TT");

        cy.contains("Why integrate within 8 days?").click();
        cy.contains("When records are not integrated within 8 days");

        cy.contains("Practice performance");

        cy.contains("Successful integrations");

        const validNumber = /[\d]+/g;
        cy.get("[data-testid=table__cell--row-0-col-0]").contains(validNumber);

        const validMetricAsPercentOrNA = /(.+%|n\/a)/;

        cy.contains("Within 3 days");
        cy.get("[data-testid=table__cell--row-0-col-1]").contains(
          validMetricAsPercentOrNA
        );

        cy.contains("Within 8 days");
        cy.get("[data-testid=table__cell--row-0-col-2]").contains(
          validMetricAsPercentOrNA
        );

        cy.contains("Beyond 8 days");
        cy.get("[data-testid=table__cell--row-0-col-3]").contains(
          validMetricAsPercentOrNA
        );

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
