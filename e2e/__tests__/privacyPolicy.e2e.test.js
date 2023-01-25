const { viewPorts } = require("../support/common");

xdescribe("Privacy policy page", () => {
  viewPorts.map((viewPort) => {
    xdescribe(`${viewPort.device} viewport`, () => {
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

      it("contains title and description metadata", () => {
        cy.contains("a", "Your privacy").click();
        cy.title().should("eq", "Your Privacy - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Privacy Policy for GP Registrations Data"
        );
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/your-privacy");
        cy.contains("h3", "Feedback");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
