const { viewPorts } = require("../support/common");

describe("CCG page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/ccg/10D");
        cy.injectAxe();
      });

      it("displays redirect notice and goes to the new integration times page", () => {
        cy.contains("h1", "This page has been moved.");

        cy.checkAccessibility();

        cy.contains("a", "Test CCG - 10D integration times").click();
        cy.contains("h1", "Test CCG - 10D");
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/ccg/10D");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
