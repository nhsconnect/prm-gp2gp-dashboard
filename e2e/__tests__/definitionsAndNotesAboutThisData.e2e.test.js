const { viewPorts } = require("../support/common");

xdescribe("Definitions and notes about this data page", () => {
  viewPorts.map((viewPort) => {
    xdescribe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays Definitions and notes about this data page", () => {
        cy.contains("a", "Definitions and notes about this data").click();
        cy.contains("h1", "Definitions and notes about this data");
        cy.contains("h2", "Definitions");
        cy.contains("h2", "About this data");

        cy.contains("Registrations that triggered GP2GP transfer").click();
        cy.contains(
          "Total number of registrations that triggered a GP2GP transfer between the 1st and the last day of the month."
        );
        cy.checkAccessibility();
      });

      it("contains title and description metadata", () => {
        cy.visit("/definitions-and-notes-about-this-data");
        cy.title().should(
          "eq",
          "Definitions and notes about this data - GP Registrations Data"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Definition and notes about this data for GP Registrations Data"
        );
      });

      it("navigates from download data page to definitions and notes page new a new tab", () => {
        cy.visit("/sub-ICB-location/10D/download-data");
        cy.contains("h2", "Download data");
        cy.contains(
          "Definitions and notes about this data (opens in a new tab)"
        )
          .should("have.attr", "href")
          .and("include", "/definitions-and-notes-about-this-data");
      });
    });
  });
});
