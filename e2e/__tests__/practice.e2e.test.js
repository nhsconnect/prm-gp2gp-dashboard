const { viewPorts } = require("../support/common");

describe("Practice page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/practice/A12347");
        cy.injectAxe();
      });

      it("displays redirect notice and goes to the new integration times page", () => {
        cy.contains("h1", "This page has been moved.");

        cy.checkAccessibility();

        cy.contains(
          "a",
          "Test GP Practice With Some Integrations - A12347 integration times"
        ).click();
        cy.contains("h1", "Test GP Practice With Some Integrations - A12347");
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/practice/A12347");
        cy.contains("h3", "Feedback");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
