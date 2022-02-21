const { viewPorts } = require("../support/common");

describe("Home page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays the home page with the search input", () => {
        cy.contains("h1", "GP2GP patient record transfers data");
        cy.contains("h2", "About");
        cy.contains("h2", "Search");
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        );
        cy.contains("button", "Search");
        cy.contains("h2", "What you can find out");
        cy.contains("h2", "What this data can’t tell you");
        cy.checkAccessibility();
      });

      it("displays the validation error when there is no input", () => {
        cy.contains("button", "Search").click();
        cy.contains("Please enter a valid ODS code, practice name or CCG name");
        cy.checkAccessibility();
      });

      it("contains the title and description metadata", () => {
        cy.title().should("eq", "GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Search for monthly data about GP2GP transfers for practices in England"
        );
      });
    });
  });
});
