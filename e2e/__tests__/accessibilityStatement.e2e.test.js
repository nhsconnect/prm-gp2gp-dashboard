const { viewPorts } = require("../support/common");

describe("Accessibility statement page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/accessibility-statement");
      });

      it("checks for accessibility on accessibility statement page", () => {
        cy.injectAxe();
        cy.checkAccessibility();
      });

      it("contains title and description metadata", () => {
        cy.contains("a", "Accessibility statement").click();
        cy.title().should(
          "eq",
          "Accessibility statement - GP Registrations Data"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Accessibility Statement for GP Registrations Data"
        );
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });

      it("displays accessibility statement page upon navigation to page", () => {
        cy.visit("/");
        cy.contains("a", "Accessibility statement").click();
        cy.contains("h1", "Accessibility statement");
        cy.contains("How accessible this website is");
      });

      it("clicking on Accessibility statement link from homepage will navigate to accessibility page", () => {
        cy.visit("/");
        cy.contains("a", "Accessibility statement").click();
        cy.contains("h1", "Accessibility statement");
      });
    });
  });
});
