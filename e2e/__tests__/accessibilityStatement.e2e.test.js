const { viewPorts } = require("../support/common");

describe("Accessibility statement page", () => {
  viewPorts.map((viewPort) => {
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
        cy.visit("/accessibility-statement");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
