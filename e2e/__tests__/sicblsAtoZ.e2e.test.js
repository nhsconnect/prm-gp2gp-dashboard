const { viewPorts } = require("../viewPorts");
const { terminalLog } = require("../axeLog");

describe("Sub ICB Location A to Z page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays Sub ICB Location A to Z page and navigates to a selected Sub ICB Locations", () => {
        cy.contains("a", "Sub ICB Location A to Z").scrollIntoView().click();
        cy.contains("h1", "Sub ICB Location A to Z");
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

        cy.title().should(
          "eq",
          "Sub ICB Location A to Z - GP Registrations Data"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Alphabetical list of all Sub ICB Locations in England"
        );

        cy.contains("a", "T").click();
        cy.contains("a", "Test ICB - 10D").click();
        cy.contains("h1", "Test ICB - 10D");
      });
    });
  });
});
