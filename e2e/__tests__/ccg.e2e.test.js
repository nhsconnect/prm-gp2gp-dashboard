const { viewPorts } = require("../support/common");
const { organisations } = require("/local-mocks/mocks.js");

describe("CCG page", () => {
  const odsUrl =
    "/ORD/2-0-0/organisations?RelTypeId=RE4&TargetOrgId=10D&RelStatus=active&Limit=1000";

  viewPorts.map((viewPort) => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
      });

      it("checks for accessibility", () => {
        cy.visit("/ccg/10D");
        cy.intercept("GET", odsUrl, organisations);

        cy.injectAxe();
        cy.checkAccessibility();
      });

      it("contains the title and description metadata relevant to the page", () => {
        cy.visit("/ccg/10D");
        cy.intercept("GET", odsUrl, organisations);

        cy.title().should(
          "eq",
          "Test CCG With GP Practices - 10D - GP Registrations Data"
        );
        cy.get('meta[name="description"]').should(
          "have.attr",
          "content",
          "Monthly data about GP2GP transfers for practices within this clinical commissioning group"
        );
      });

      it("displays the practice metrics of the associated practice", () => {
        cy.visit("/ccg/10D");
        cy.intercept("GET", odsUrl, organisations);

        cy.contains("h1", "Test CCG With GP Practices - 10D");

        cy.contains("Why integrate within 8 days").click();
        cy.contains("When records are not integrated within 8 days");
        cy.contains("Integration times for December 2019");

        cy.contains("Practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With Integrations - A12345"
        );

        cy.contains("Successful integrations");
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains(3);

        cy.contains("Integrated within 3 days");
        cy.get('[data-testid="table__cell--row-0-col-2"]').contains("33.3%");

        cy.contains("Integrated within 8 days");
        cy.get('[data-testid="table__cell--row-0-col-3"]').contains("33.3%");

        cy.contains("Integrated beyond 8 days");
        cy.get('[data-testid="table__cell--row-0-col-4"]').contains("33.3%");
      });

      it("sort practice performance table and link to the individual practices", () => {
        cy.visit("/ccg/10D");
        cy.intercept("GET", odsUrl, organisations);

        cy.contains("h1", "Test CCG With GP Practices - 10D");

        cy.contains("Practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(
          "Test GP Practice With Integrations - A12345"
        );
        cy.get('[data-testid="table__cell--row-1-col-0"]').contains(
          "Test GP Practice With Some Integrations - A12347"
        );
        cy.get('[data-testid="table__cell--row-2-col-0"]').contains(
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
          "Test GP Practice With Integrations - A12345"
        );
        cy.get('[data-testid="table__cell--row-1-col-0"]').contains(
          "Test GP Practice With No Integrations - A12346"
        );
        cy.get('[data-testid="table__cell--row-2-col-0"]').contains(
          "Test GP Practice With Some Integrations - A12347"
        );

        cy.contains("a", "Test GP Practice With Integrations - A12345")
          .should("have.attr", "href")
          .and("contains", "practice/A12345");
      });

      it("displays the feedback section that links to feedback survey", () => {
        cy.visit("/ccg/10D");
        cy.intercept("GET", odsUrl, organisations);

        cy.contains("h3", "Get in touch");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });

      it("searches on homepage then navigates to the CCG page", () => {
        cy.visit("/");
        cy.intercept("GET", odsUrl, organisations);

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test ccg");
        cy.contains("li", "CCG").parent().parent().click();
        cy.contains("button", "Search").click();

        cy.contains("h1", "Test CCG With GP Practices - 10D");
      });

      it("searches on homepage and navigates to the CCG page with no practices associated to that ccg", () => {
        const odsUrlNoCCG =
          "/ORD/2-0-0/organisations?RelTypeId=RE4&TargetOrgId=11D&RelStatus=active&Limit=1000";

        cy.visit("/");
        cy.intercept("GET", odsUrlNoCCG, {
          Organisations: [],
        });

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test ccg without");
        cy.contains("li", "CCG").parent().parent().click();
        cy.contains("button", "Search").click();

        cy.contains("No GP practices found");
      });

      it("searches on homepage, navigates to the CCG page and displays an error when it can't fetch the CCG data", () => {
        cy.visit("/");
        cy.intercept("GET", odsUrl, {
          statusCode: 400,
        });

        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("test");
        cy.contains("li", "CCG").parent().parent().click();
        cy.contains("button", "Search").click();

        cy.contains("Error loading practice list");
      });
    });
  });
});
