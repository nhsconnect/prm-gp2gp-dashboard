const { viewPorts } = require("../support/common");

describe("Cookie page", () => {
  viewPorts.map((viewPort) => {
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

        cy.contains("Save my cookie settings").click();
        cy.contains("h1", "Your cookie settings have been saved");
        cy.checkAccessibility();
      });

      it("contains the title and description after navigating to cookie policy page", () => {
        cy.contains("Do not use analytics cookies").click();
        cy.contains("a", "cookies page").click();
        cy.title().should(
          "eq",
          "Cookies policy - GP Registrations Data Platform"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Cookie Policy for the GP Registrations Data Platform"
        );
        cy.checkAccessibility();
      });
    });
  });
});
