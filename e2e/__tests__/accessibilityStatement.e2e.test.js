const { viewPorts } = require("../viewPorts");
const { terminalLog } = require("../axeLog");

describe("Accessibility statement page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays accessibility statement page", () => {
        cy.contains("a", "Accessibility statement").scrollIntoView().click();
        cy.contains("h1", "Accessibility statement");
        cy.contains("How accessible this website is");
        cy.checkA11y(
          null,
          {
            rules: {
              "landmark-unique": { enabled: false },
              region: { enabled: false },
            },
          },
          terminalLog
        );
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
    });
  });
});
