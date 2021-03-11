const { viewPorts } = require("../support/common");

describe("Privacy policy page", () => {
  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays your privacy page", () => {
        cy.contains("a", "Your privacy").click();
        cy.contains("h1", "Your privacy");
        cy.contains("Information we may collect");
        cy.checkAccessibility();
      });
    });
  });
});
