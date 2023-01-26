const { viewPorts } = require("../support/common");

xdescribe("SICBL Download Data page", () => {
  viewPorts.map((viewPort) => {
    xdescribe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches, navigates to an individual SICBL integration times page, navigates to SICBL download data page via contents menu and downloads CSV files", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Sub ICB Location name"
        ).type("Test ICB");
        cy.contains("li", "Test ICB - 10D").parent().parent().click();

        cy.contains("button", "Search").click();

        cy.contains("h1", "Test ICB - 10D");

        cy.contains("h2", "Contents");
        cy.contains("li", "Integration times");
        cy.contains("li", "GP2GP transfers requested");
        cy.contains("li", "Download data").click();

        cy.contains("h2", "Download data");

        cy.title().should("eq", "Test ICB - 10D - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Monthly data about GP2GP transfers for practices within this integrated care board"
        );

        cy.contains(
          "To download data for this Sub ICB Location in CSV format select from the options below"
        );

        cy.get("[data-testid=gp2gp-download-data]").within(() => {
          cy.contains("Which dataset would you like to download?");
          cy.get('[type="radio"]').check(["latest-month", "last-6-months"]);
          cy.contains("What timeframe would you like data for?");
          cy.get('[type="radio"]').check([
            "all",
            "integration-times",
            "transfers-requested",
          ]);
        });

        cy.get("[data-testid=gp2gp-download-data]").within(() => {
          cy.contains("Transfers requested").click();
          cy.contains("Latest month").click();
        });
        cy.contains("button", "Download").click();

        const transfersRequestedLatestMonth = cy.readFile(
          "./e2e/downloads/GP Registrations Data Test ICB - 10D transfers-requested-latest-month.csv"
        );
        transfersRequestedLatestMonth.should(
          "contain",
          "GP2GP technical failures (paper copy requested)"
        );
        transfersRequestedLatestMonth.should("contain", "75%");

        cy.get("[data-testid=gp2gp-download-data]").within(() => {
          cy.contains("Integration times").click();
          cy.contains("Last 6 months").click();
        });
        cy.contains("button", "Download").click();

        const integrationTimesLast6Months = cy.readFile(
          "./e2e/downloads/GP Registrations Data Test ICB - 10D integration-times-last-6-months.csv"
        );
        integrationTimesLast6Months.should(
          "contain",
          "Integrated within 3 days - %"
        );
        integrationTimesLast6Months.should("contain", "16.7%");

        cy.get("[data-testid=gp2gp-download-data]").within(() => {
          cy.contains("All").click();
          cy.contains("Last 6 months").click();
        });
        cy.contains("button", "Download").click();

        const allLast6Months = cy.readFile(
          "./e2e/downloads/GP Registrations Data Test ICB - 10D all-last-6-months.csv"
        );
        allLast6Months.should(
          "contain",
          "GP2GP technical failures (paper copy requested)"
        );
        allLast6Months.should("contain", "75%");
        allLast6Months.should("contain", "Integrated within 3 days - %");
        allLast6Months.should("contain", "16.7%");

        cy.contains("Data updated: February 2020");

        cy.checkAccessibility();
      });
    });
  });
});
