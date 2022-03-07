const { viewPorts } = require("../support/common");

describe("CCG Download Data page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches, navigates to an individual CCG integration times page, navigates to CCG download data page via contents menu and goes back to home page", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("Test CCG 10D");
        cy.contains("li", "Test CCG").parent().parent().click();

        cy.contains("button", "Search").click();

        cy.contains("h1", "Test CCG - 10D");

        cy.contains("h2", "Contents");
        cy.contains("li", "Integration times");
        cy.contains("li", "GP2GP transfers requested");
        cy.contains("li", "Download data").click();

        cy.contains("h2", "Download data");

        cy.title().should("eq", "Test CCG - 10D - GP Registrations Data");
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        );

        cy.contains(
          "To download data for this CCG in CSV format select from the options below"
        );

        cy.get("[data-testid=gp2gp-download-data]").within(() => {
          cy.contains("Which dataset would you like to download?");
          cy.contains("Transfers requested").click();
          cy.contains("What timeframe would you like data for?");
          cy.contains("Latest month").click();
        });
        cy.contains("button", "Download").click();

        const transfersRequestedLatestMonth = cy.readFile(
          "./e2e/downloads/GP Registrations Data Test CCG transfers-requested-latest-month.csv"
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
          "./e2e/downloads/GP Registrations Data Test CCG integration-times-last-6-months.csv"
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
          "./e2e/downloads/GP Registrations Data Test CCG all-last-6-months.csv"
        );
        allLast6Months.should(
          "contain",
          "GP2GP technical failures (paper copy requested)"
        );
        allLast6Months.should("contain", "75%");
        allLast6Months.should("contain", "Integrated within 3 days - %");
        allLast6Months.should("contain", "16.7%");

        cy.checkAccessibility();
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/ccg/11D/download-data");
        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });
    });
  });
});
