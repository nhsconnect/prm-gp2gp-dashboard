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

        cy.contains("h2", "GP2GP National Performance for December 2019");

        cy.contains("h3", "Transfers started");
        cy.get('[data-testid="national-statistics__initiated-count"]').contains(
          "Count: 9"
        );

        cy.contains("h3", "Successful integrations within 8 days");
        cy.get(
          '[data-testid="national-statistics__integrated-count"]'
        ).contains("Count: 4");
        cy.get(
          '[data-testid="national-statistics__integrated-percent"]'
        ).contains("Percent: 44.44%");

        cy.contains("h3", "Paper fallback transfers");
        cy.get(
          '[data-testid="national-statistics__paper-fallback-count"]'
        ).contains("Count: 5");
        cy.get(
          '[data-testid="national-statistics__paper-fallback-percent"]'
        ).contains("Percent: 55.56%");

        cy.contains("h4", "Process failure");
        cy.contains("h5", "Transferred, not integrated");
        cy.contains("h5", "Integrated late (beyond 8 days)");
        cy.contains("Transferred, not integrated");
        cy.get(
          '[data-testid="national-statistics__transferred-not-int-count"]'
        ).contains("Count: 1");
        cy.get(
          '[data-testid="national-statistics__transferred-not-int-percent"]'
        ).contains("Percent: 11.11%");

        cy.contains("Integrated late (beyond 8 days)");

        cy.get('[data-testid="national-statistics__int-late-count"]').contains(
          "Count: 1"
        );
        cy.get(
          '[data-testid="national-statistics__int-late-percent"]'
        ).contains("Percent: 11.11%");

        cy.contains("h4", "Technical failures");
        cy.get('[data-testid="national-statistics__failed-count"]').contains(
          "Count: 2"
        );
        cy.get('[data-testid="national-statistics__failed-percent"]').contains(
          "Percent: 22.22%"
        );

        cy.contains("h4", "Unclassified failures");
        cy.get(
          '[data-testid="national-statistics__unclassified-count"]'
        ).contains("Count: 1");
        cy.get(
          '[data-testid="national-statistics__unclassified-percent"]'
        ).contains("Percent: 11.11%");

        cy.checkAccessibility();
      });

      it("contains the title and description metadata", () => {
        cy.title().should("eq", "National Statistics - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "National monthly data about GP2GP transfers"
        );
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
