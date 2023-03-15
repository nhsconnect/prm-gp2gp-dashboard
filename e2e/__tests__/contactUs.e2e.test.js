const { viewPorts } = require("../viewPorts");

describe("Contact us page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        // cy.injectAxe();
        cy.visit("/");
      });

      it("displays Contact us page", () => {
        cy.contains("a", "Contact us").scrollIntoView().click();
        cy.contains("h1", "Contact us");
        cy.contains(
          "We are unable to assist with individual patient or practice queries"
        );
        // cy.checkAccessibility()
      });

      it("contains title and description metadata", () => {
        cy.contains("a", "Contact us").click();
        cy.title().should("eq", "Contact us - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "If you are a patient and you need medical advice, you should call 111. The GP Registrations Data team can help with enquiries about the data displayed on this site, not with individual patient or practice queries."
        );
      });
    });
  });
});
