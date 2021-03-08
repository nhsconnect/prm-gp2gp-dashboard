describe("E2E Tests", () => {
  it("displays the cookie banner on the homepage and navigates to the cookie policy page", () => {
    cy.visit("/");

    cy.contains("h1", "Search");
    cy.contains("Do not use analytics cookies").click();
    cy.contains(
      "You can change your cookie settings at any time using our cookies page."
    );
    cy.contains("a", "cookies page").click();
    cy.contains("h1", "Cookie Policy");
  });

  it("displays the feedback form", () => {
    cy.visit("/");

    cy.contains("Tell us what you think");
    cy.contains("Take our survey").click();
    cy.contains("Feedback form for GP registrations data platform");
  });

  it("displays the validation error when there is no input", () => {
    cy.visit("/");

    cy.contains("button", "Search").click();
    cy.contains("Please enter a valid ODS code, practice name or CCG name");
  });

  it("searches and navigates to the CCG page and then navigates to an individual practice page", () => {
    cy.visit("/");

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
    cy.contains("Successful integrations");
    cy.contains("Within 3 days");
    cy.contains("Within 8 days");
    cy.contains("Beyond 8 days");

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
    cy.visit("/");

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
    cy.contains("Within 3 days");
    cy.contains("Within 8 days");
    cy.contains("Beyond 8 days");
  });

  //TODO: national metrics
  xit("displays national metrics page", () => {});

  it("displays 404 not found page", () => {
    cy.visit("/some-page", { failOnStatusCode: false });
    //dev and prod display different content
    cy.contains(/not found| 404 page/g);
  });

  it("displays your privacy page", () => {
    cy.visit("/");
    cy.contains("a", "Your privacy").click();
    cy.contains("h1", "Your privacy");
    cy.contains("Information we may collect");
  });

  it("displays accessibility statement page", () => {
    cy.visit("/");

    cy.contains("a", "Accessibility statement").click();
    cy.contains("h1", "Accessibility statement");
    cy.contains("How accessible this website is");
  });
});
