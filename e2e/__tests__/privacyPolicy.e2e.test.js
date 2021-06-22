const { viewPorts } = require("../support/common");

describe("Privacy policy page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/your-privacy");
      });

      it("check accessibility on privacy policy page", () => {
        cy.injectAxe();
        cy.checkAccessibility();
      });

      it("contains title and description metadata", () => {
        cy.title().should("eq", "Your Privacy - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Privacy Policy for GP Registrations Data"
        );
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });

      it("displays your privacy page after clicking on link", () => {
        cy.visit("/");
        cy.contains("a", "Your privacy").click();
        cy.contains("h1", "Your privacy");
        cy.contains("Information we may collect");
      });
    });
  });
});
