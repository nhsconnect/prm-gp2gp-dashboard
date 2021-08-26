const { viewPorts } = require("../support/common");

describe("CCG page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches and navigates to the CCG page", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test ccg");
        cy.contains("li", "CCG").parent().parent().click();
        cy.contains("button", "Search").click();

        // CCG Page
        cy.contains("h1", "Test CCG - 10D");
        cy.title().should("eq", "Test CCG - 10D - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        );

        cy.contains("Why integrate within 8 days").click();
        cy.contains("When records are not integrated within 8 days");
        cy.contains("Integration times for December 2019");

        cy.contains("Practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With Integrations - A12345"
        );

        cy.contains("Transfers received");
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains(4);

        cy.contains("Integrated within 3 days");
        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("25%");

        cy.contains("Integrated within 8 days");
        cy.get('[data-testid="table__cell--row-0-col-3"]').contains("25%");

        cy.contains("Integrated beyond 8 days");
        cy.get('[data-testid="table__cell--row-0-col-4"]').contains("25%");

        cy.contains("h2", "About this data").should("not.exist");
        cy.contains("h2", "Definitions").should("not.exist");

        cy.contains("button", "About").click();
        cy.contains("h2", "About this data");
        cy.contains("Test GP Practice With Integrations - A12345").should(
          "not.exist"
        );
        cy.contains("h2", "Definitions").should("not.exist");

        cy.contains("button", "Definitions").click();
        cy.contains("h2", "Definitions");
        cy.contains("Test GP Practice With Integrations - A12345").should(
          "not.exist"
        );
        cy.contains("h2", "About this data").should("not.exist");

        cy.contains("button", "Data table").click();
        cy.contains("Test GP Practice With Integrations - A12345");
      });

      it("sort practice performance table and link to the individual practices", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("another test ccg");
        cy.contains("li", "CCG").parent().parent().click();
        cy.contains("button", "Search").click();

        cy.contains("h1", "Another Test CCG - 11D");

        cy.contains("Practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With Some Integrations - A12347"
        );
        cy.get('[data-testid="table__cell--row-1-col-0"]').contains(
          "Test GP Practice With No Integrations - A12346"
        );

        cy.contains("Sort by");
        cy.get("select#sortBySelect option:selected").should(
          "have.text",
          "Beyond 8 days"
        );

        cy.contains("Order");
        cy.get("select#orderSelect option:selected").should(
          "have.text",
          "Descending"
        );

        cy.get("select#sortBySelect").select("Practice name");
        cy.get("select#sortBySelect option:selected").should(
          "have.text",
          "Practice name"
        );

        cy.get("select#orderSelect").select("Ascending");
        cy.get("select#orderSelect option:selected").should(
          "have.text",
          "Ascending"
        );

        cy.contains("Practice name");

        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With No Integrations - A12346"
        );
        cy.get('[data-testid="table__cell--row-1-col-0"]').contains(
          "Test GP Practice With Some Integrations - A12347"
        );

        cy.checkAccessibility();

        cy.contains("a", "Test GP Practice With No Integrations - A12346")
          .should("have.attr", "href")
          .and("contains", "practice/A12346");
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/ccg/10D");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
