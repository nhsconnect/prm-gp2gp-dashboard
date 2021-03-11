const { viewPorts } = require("../support/common");

describe("Cookie page", () => {
  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays the cookie banner and navigates to the cookie policy page", () => {
        cy.contains("Do not use analytics cookies").click();
        cy.contains(
          "You can change your cookie settings at any time using our cookies page."
        );
        cy.contains("a", "cookies page").click();
        cy.contains("h1", "Cookie Policy");
        cy.checkAccessibility();
      });
    });
  });
});
