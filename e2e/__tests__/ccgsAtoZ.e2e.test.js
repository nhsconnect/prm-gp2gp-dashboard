const { viewPorts } = require("../support/common");

describe("CCG A to Z page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays CCG A to Z page and navigates to a selected CCG", () => {
        cy.contains("a", "CCG A to Z").click();
        cy.contains("h1", "CCG A to Z");
        cy.checkAccessibility();

        cy.title().should("eq", "CCG A to Z - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Alphabetical list of all CCGs in England"
        );

        cy.contains("a", "T").click();
        cy.contains("a", "Test CCG - 10D").click();
        cy.contains("h1", "Test CCG - 10D");
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/ccgs");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
