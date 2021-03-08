describe("E2E Tests", () => {
  const viewPorts = [
    { device: "Desktop", width: 1280, height: 720 },
    { device: "Mobile", width: 320, height: 480 },
  ];

  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/");
        cy.injectAxe();
      });

      it("displays the home page with the search input", () => {
        cy.contains("h1", "Search");
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        );
        cy.contains("button", "Search");
        cy.checkAccessibility();
      });

      it("displays the cookie banner and navigates to the cookie policy page", () => {
        cy.contains("Do not use analytics cookies").click();
        cy.contains(
          "You can change your cookie settings at any time using our cookies page."
        );
        cy.contains("a", "cookies page").click();
        cy.contains("h1", "Cookie Policy");
        cy.checkAccessibility();
      });

      it("displays the feedback form", () => {
        cy.contains("Tell us what you think");
        cy.contains("Take our survey").click();
        cy.contains("Feedback form for GP registrations data platform");
      });

      it("displays the validation error when there is no input", () => {
        cy.contains("button", "Search").click();
        cy.contains("Please enter a valid ODS code, practice name or CCG name");
        cy.checkAccessibility();
      });

      it("searches and navigates to the CCG page and then navigates to an individual practice page", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("bolton");
        cy.contains("li", "CCG")
          .parent()
          .parent()
          .click();
        cy.contains("button", "Search").click();

        // CCG Page
        cy.contains("Practice performance");

        cy.contains("Practice name");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(/.+/g);

        cy.contains("Successful integrations");
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains(/[\d]+/g);

        cy.contains("Within 3 days");
        cy.get('[data-testid="table__cell--row-0-col-2"]').contains(
          /^(.+%|n\/a)$/g
        );

        cy.contains("Within 8 days");
        cy.get('[data-testid="table__cell--row-0-col-3"]').contains(
          /^(.+%|n\/a)$/g
        );

        cy.contains("Beyond 8 days");
        cy.get('[data-testid="table__cell--row-0-col-4"]').contains(
          /^(.+%|n\/a)$/g
        );
        cy.checkAccessibility();

        // Navigate to Practice page
        cy.contains("td", /Practice|Centre/g)
          .first()
          .then($el => {
            const practiceName = $el.text();
            cy.contains(practiceName).click();

            const odsCode = practiceName.split("|")[1].trim();
            cy.url().should("include", `/${odsCode}`);
            cy.contains("h1", odsCode);
          });
      });

      it("searches and navigates to an individual practice page", () => {
        cy.findByLabelText(
          "Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
        ).type("Bolton Community Practice");
        cy.contains("li", "Bolton Community Practice")
          .parent()
          .parent()
          .click();

        cy.contains("button", "Search").click();

        //TODO: Make data agnostic
        cy.contains("h1", "Bolton Community Practice");
        cy.contains("Y03079");
        cy.contains("Waters Meeting Health Centre");
        cy.contains("Waters Meeting Road");
        cy.contains("Bolton");
        cy.contains("BL1 8TT");

        cy.contains("Practice performance");

        cy.contains("Successful integrations");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(/[\d]+/g);

        cy.contains("Within 3 days");
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains(
          /^(.+%|n\/a)$/g
        );

        cy.contains("Within 8 days");
        cy.get('[data-testid="table__cell--row-0-col-2"]').contains(
          /^(.+%|n\/a)$/g
        );

        cy.contains("Beyond 8 days");
        cy.get('[data-testid="table__cell--row-0-col-3"]').contains(
          /^(.+%|n\/a)$/g
        );

        cy.checkAccessibility();
      });

      it("displays national metrics page", () => {
        cy.visit("/national-gp2gp-statistics");

        cy.contains("h1", "National data on GP2GP performance");
        cy.contains("h3", "Total number of transfers initiated");
        cy.contains("h3", "SLA Bandings/Metrics");
        cy.contains("h3", "Total paper fall back rate");
        cy.contains("h3", "Failed transfers");
        cy.contains("h3", "Pending transfers");
      });

      it("displays 404 not found page", () => {
        cy.visit("/some-page", { failOnStatusCode: false });
        //dev and prod display different content
        cy.contains(/not found| 404 page/g);
      });

      it("displays your privacy page", () => {
        cy.contains("a", "Your privacy").click();
        cy.contains("h1", "Your privacy");
        cy.contains("Information we may collect");
        cy.checkAccessibility();
      });

      it("displays accessibility statement page", () => {
        cy.contains("a", "Accessibility statement").click();
        cy.contains("h1", "Accessibility statement");
        cy.contains("How accessible this website is");
        cy.checkAccessibility();
      });
    });
  });
});
