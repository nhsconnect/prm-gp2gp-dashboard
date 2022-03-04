const { viewPorts } = require("../support/common");
const { practiceWithSomeIntegrations } = require("../../local-mocks/mocks");

describe("Practice Download Data page", () => {
  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("searches, navigates to an individual practice integration times page, navigates to practice download data page via contents menu and goes back to home page", () => {
        cy.intercept(
          "/ORD/2-0-0/organisations/A12347",
          practiceWithSomeIntegrations
        );
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("Test GP Practice With Some Integrations A12347");
        cy.contains("li", "Test GP Practice With Some Integrations")
          .parent()
          .parent()
          .click();

        cy.contains("button", "Search").click();

        cy.contains("h1", "Test GP Practice With Some Integrations - A12347");

        cy.contains("h2", "Contents");
        cy.contains("li", "Integration times");
        cy.contains("li", "GP2GP transfers requested");
        cy.contains("li", "Download data").click();

        cy.contains("h2", "Download data");

        cy.title().should(
          "eq",
          "Test GP Practice With Some Integrations - A12347 - GP Registrations Data"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Monthly data about GP2GP transfers for this practice"
        );

        cy.contains(
          "To download data for this practice in CSV format select from the options below"
        );

        cy.get("[data-testid=gp2gp-download-data]").within(() => {
          cy.contains("Which dataset would you like to download?");
          cy.contains("Transfers requested").click();
          cy.contains("What timeframe would you like data for?");
          cy.contains("Latest month").click();
        });
        cy.contains("button", "Download").click();

        const transfersRequestedLatestMonth = cy.readFile(
          "./e2e/downloads/transfersRequested-latestMonth.csv"
        );
        transfersRequestedLatestMonth.should(
          "contain",
          "GP2GP technical failures (paper copy requested)"
        );
        transfersRequestedLatestMonth.should("contain", "33.3%");

        cy.get("[data-testid=gp2gp-download-data]").within(() => {
          cy.contains("Integration times").click();
          cy.contains("Last 6 months").click();
        });
        cy.contains("button", "Download").click();

        const integrationTimesLast6Months = cy.readFile(
          "./e2e/downloads/integrationTimes-last6Months.csv"
        );
        integrationTimesLast6Months.should(
          "contain",
          "Integrated within 3 days - %"
        );
        integrationTimesLast6Months.should("contain", "50%");

        cy.get("[data-testid=gp2gp-download-data]").within(() => {
          cy.contains("All").click();
          cy.contains("Last 6 months").click();
        });
        cy.contains("button", "Download").click();

        const allLast6Months = cy.readFile(
          "./e2e/downloads/all-last6Months.csv"
        );
        allLast6Months.should(
          "contain",
          "GP2GP technical failures (paper copy requested)"
        );
        allLast6Months.should("contain", "33.3%");
        allLast6Months.should("contain", "Integrated within 3 days - %");
        allLast6Months.should("contain", "50%");

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