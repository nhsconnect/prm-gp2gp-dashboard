const { viewPorts } = require("../viewPorts");

describe("Privacy policy page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays your privacy page", () => {
        cy.contains("a", "Your privacy").scrollIntoView().click();
        cy.contains("h1", "Your privacy");
        cy.contains("Information we may collect");
        // cy.checkAccessibility()
      });

      it("contains title and description metadata", () => {
        cy.contains("a", "Your privacy").click();
        cy.title().should("eq", "Your Privacy - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Privacy Policy for GP Registrations Data"
        );
      });
    });
  });
});
