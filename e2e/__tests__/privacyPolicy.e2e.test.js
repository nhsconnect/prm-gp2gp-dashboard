const { viewPorts } = require("../viewPorts");
const { terminalLog } = require("../axeLog");

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
