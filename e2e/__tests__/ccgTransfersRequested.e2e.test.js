const { viewPorts } = require("../support/common");

describe("CCG Transfers Requested page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches, navigates to an individual CCG integration times page, navigates to CCG transfers requested page via contents menu and goes back to home page", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("Test CCG 10D");
        cy.contains("li", "Test CCG").parent().parent().click();

        cy.contains("button", "Search").click();

        cy.contains("h1", "Test CCG - 10D");

        cy.contains("h2", "Contents");
        cy.contains("li", "Integration times");
        cy.contains("li", "GP2GP transfers requested").click();
        cy.contains(
          "h2",
          "GP2GP transfers requested for registering practices"
        );

        cy.contains("li", "Integration times").click();
        cy.contains("Integration times for registering practice");
        cy.contains("li", "GP2GP transfers requested").click();
        cy.contains(
          "h2",
          "GP2GP transfers requested for registering practices"
        );

        cy.title().should("eq", "Test CCG - 10D - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        );

        cy.contains("What happens when a GP2GP transfer fails?").click();
        cy.contains(
          "A task will automatically be created for the sending practice"
        );

        cy.contains(
          "GP2GP transfers requested for registering practices - December 2019"
        );

        cy.get("[data-testid=gp2gp-table]").within(() => {
          cy.contains("Registering practice name");
          cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
            "Test GP Practice With Integrations - A12345"
          );

          cy.contains("GP2GP transfers requested");
          cy.get("[data-testid=table__cell--row-0-col-1]").contains(8);

          cy.contains("GP2GP transfers received");
          cy.get("[data-testid=table__cell--row-0-col-2]").contains("75%");

          cy.contains("GP2GP technical failures");
          cy.get("[data-testid=table__cell--row-0-col-3]").contains("25%");
        });

        cy.get("[data-testid=gp2gp-open-modal-btn]")
          .filter(":visible")
          .eq(0)
          .click();
        cy.contains(
          "Total number of registrations that triggered a GP2GP transfer"
        );
        cy.contains("button", "Close").click();

        cy.contains("h3", "How we calculate the data").should("not.exist");
        cy.contains("h2", "Definitions").should("not.exist");

        cy.contains("button", "Notes about this data").click();
        cy.contains("h3", "How we calculate the data");
        cy.contains("Test GP Practice With Integrations - A12345").should(
          "not.exist"
        );
        cy.contains("h2", "Definitions").should("not.exist");

        cy.contains("button", "Definitions").click();
        cy.contains("h2", "Definitions");
        cy.contains("Test GP Practice With Integrations - A12345").should(
          "not.exist"
        );
        cy.contains("h3", "How we calculate the data").should("not.exist");

        cy.contains("button", "Data table").click();
        cy.contains("Test GP Practice With Integrations - A12345");
        cy.contains("Data updated: February 2020");
        cy.checkAccessibility();

        cy.contains(
          `[data-testid=back-to-search__${viewPort.device.toLowerCase()}]`,
          "Back to search"
        ).click();
        cy.contains("h1", "GP2GP patient record transfers data");
      });

      it("sort practice performance table and link to the individual practices", () => {
        cy.visit("/ccg/11D/gp2gp-transfers-requested");
        cy.contains("h1", "Another Test CCG - 11D");

        cy.contains("Requesting practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With Some Integrations - A12347"
        );
        cy.get('[data-testid="table__cell--row-1-col-0"]').contains(
          "Test GP Practice With No Integrations - A12346"
        );

        cy.contains("Sort by");
        cy.get("select#sortBySelect option:selected").should(
          "have.text",
          "GP2GP technical failures"
        );

        cy.contains("Order");
        cy.get("select#orderSelect option:selected").should(
          "have.text",
          "Descending"
        );

        // remove with showContentsNavigation feature toggle
        // at the moment it needs to wait for the feature toggle to load
        cy.wait(3000);

        cy.get("select#sortBySelect").select("Requesting practice name");
        cy.get("select#sortBySelect option:selected").should(
          "have.text",
          "Requesting practice name"
        );

        cy.get("select#orderSelect").select("Ascending");
        cy.get("select#orderSelect option:selected").should(
          "have.text",
          "Ascending"
        );

        cy.contains("Requesting practice name");

        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With No Integrations - A12346"
        );
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains(0);
        cy.get('[data-testid="table__cell--row-1-col-0"]').contains(
          "Test GP Practice With Some Integrations - A12347"
        );
        cy.get('[data-testid="table__cell--row-1-col-1"]').contains(3);

        cy.contains("a", "Test GP Practice With No Integrations - A12346")
          .should("have.attr", "href")
          .and("contains", "practice/A12346");
      });

      it("display percentages on practice performance table, change to numbers when selected", () => {
        cy.visit("/ccg/11D/gp2gp-transfers-requested");
        cy.contains("h1", "Another Test CCG - 11D");

        cy.get("select#unitsSelect option:selected").should(
          "have.text",
          "Percentages"
        );

        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("66.7%");

        cy.get("select#unitsSelect").select("Numbers");
        cy.get("select#unitsSelect option:selected").should(
          "have.text",
          "Numbers"
        );

        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("2");
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/ccg/11D/gp2gp-transfers-requested");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
