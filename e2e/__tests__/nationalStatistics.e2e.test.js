const { viewPorts } = require("../support/common");

describe("National statistics page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/national-gp2gp-statistics");
        cy.injectAxe();
      });

      it("displays national metrics contents", () => {
        cy.contains("h1", "National GP2GP patient record transfers data");

        cy.contains("h3", "Transfers started");
        cy.get('[data-testid="national-statistics__initiated-count"]').contains(
          "Count: 6"
        );

        cy.contains("h3", "Successful integrations");
        cy.get(
          '[data-testid="national-statistics__integrated-count"]'
        ).contains("Count: 5");
        cy.get(
          '[data-testid="national-statistics__integrated-percent"]'
        ).contains("Percent: 83.33%");

        cy.contains("h3", "Integration times");
        cy.contains("Within 3 days");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains("2");
        cy.contains("Within 8 days");
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains("2");
        cy.contains("Beyond 8 days");
        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("1");

        cy.contains("h3", "Technical failures");
        cy.get('[data-testid="national-statistics__failed-count"]').contains(
          "Count: 1"
        );
        cy.get('[data-testid="national-statistics__failed-percent"]').contains(
          "Percent: 16.67%"
        );

        cy.contains("h3", "Pending transfers");
        cy.get('[data-testid="national-statistics__pending-count"]').contains(
          "Count: 0"
        );
        cy.get('[data-testid="national-statistics__pending-percent"]').contains(
          "Percent: 0%"
        );

        cy.contains("h3", "Paper fallback transfers");
        cy.get(
          '[data-testid="national-statistics__paper-fallback-count"]'
        ).contains("Count: 2");
        cy.get(
          '[data-testid="national-statistics__paper-fallback-percent"]'
        ).contains("Percent: 33.33%");

        cy.checkAccessibility();
      });

      it("contains the title and description", () => {
        cy.title().should(
          "eq",
          "National Statistics - GP Registrations Data Platform"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "National monthly data about GP2GP transfers"
        );
      });
    });
  });
});
