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

      it("contains the title and description metadata after navigating to cookie policy page", () => {
        cy.contains("Do not use analytics cookies").click();
        cy.contains("a", "cookies page").click();
        cy.title().should("eq", "Cookies policy - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Cookie Policy for GP Registrations Data"
        );
        cy.checkAccessibility();
      });

      it("contains the title and description metadata for the cookie confirmation page", () => {
        cy.contains("Do not use analytics cookies").click();
        cy.contains("a", "cookies page").click();
        cy.contains("Save my cookie settings").click();
        cy.title().should(
          "eq",
          "Your cookie settings have been saved - GP Registrations Data"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Cookie settings confirmation page for GP Registrations Data"
        );
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/cookies-policy");
        cy.contains("h3", "Feedback");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
