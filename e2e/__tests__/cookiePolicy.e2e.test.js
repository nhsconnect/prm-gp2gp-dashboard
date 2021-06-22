const { viewPorts } = require("../support/common");

describe("Cookie page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
      });

      it("check accessibility on cookie policy page", () => {
        cy.visit("/cookies-policy");
        cy.injectAxe();
        cy.checkAccessibility();
      });

      it("check accessibility on cookie confirmation page", () => {
        cy.visit("/cookie-confirmation");
        cy.injectAxe();
        cy.checkAccessibility();
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/cookies-policy");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });

      it("displays the cookie banner on homepage and navigates to the cookie policy page", () => {
        cy.visit("/");

        cy.contains("Do not use analytics cookies").click();
        cy.contains(
          "You can change your cookie settings at any time using our cookies page."
        );
        cy.contains("a", "cookies page").click();
        cy.contains("h1", "Cookie Policy");

        cy.contains("Save my cookie settings").click();
        cy.contains("h1", "Your cookie settings have been saved");
      });
    });
  });
});
