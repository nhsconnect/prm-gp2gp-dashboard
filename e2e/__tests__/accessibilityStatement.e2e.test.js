const { viewPorts } = require("../support/common");

describe("Accessibility statement page", () => {
  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays accessibility statement page", () => {
        cy.contains("a", "Accessibility statement").click();
        cy.contains("h1", "Accessibility statement");
        cy.contains("How accessible this website is");
        cy.checkAccessibility();
      });
    });
  });
});
