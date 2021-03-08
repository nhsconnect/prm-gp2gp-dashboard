describe("E2E Tests", () => {
  it("displays the cookie banner on the homepage and navigates to the cookie policy", () => {
    cy.visit("/");

    cy.contains("Search");
    cy.contains("Do not use analytics cookies").click();
    cy.contains(
      "You can change your cookie settings at any time using our cookies page."
    );
    cy.contains("cookies page").click();
    cy.contains("Cookie Policy").click();
  });

  it("displays the feedback form", () => {
    cy.visit("/");

    cy.contains("Tell us what you think");
    cy.contains("Take our survey").click();
    cy.contains("Feedback form");
  });

  it("displays the validation error when there is no input", () => {
    cy.visit("/");

    cy.get("[data-testid='gp2gp-practice-search__button']").click();
    cy.contains("Please enter a valid ODS code, practice name or CCG name");
  });

  it("searches and navigates to the CCG page and then goes to an individual practice", () => {
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

    // Practice Page
    cy.contains("td", /Practice|Centre/g).then($el => {
      const practiceName = $el.text();
      cy.contains("td", /Practice|Centre/g).click();

      const odsCode = practiceName.split("|")[1].trim();
      cy.url().should("include", `/${odsCode}`);
      cy.contains("h1", odsCode);
    });
  });

  it("searches and navigates to an individual practice", () => {
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
    cy.contains("Bolton Community Practice");
    cy.contains("Y03079");
    cy.contains("Waters Meeting Health Centre");
    cy.contains("Waters Meeting Road");
    cy.contains("Bolton");
    cy.contains("BL1 8TT");

    cy.contains("Successful integrations");
    cy.contains("Within 3 days");
    cy.contains("Within 8 days");
    cy.contains("Beyond 8 days");
  });

  //TODO: national metrics
  xit("displays national metrics page", () => {});

  //TODO: Your privacy
  xit("displays your privacy page", () => {});

  //TODO: Accessibility statement
  xit("displays accessibility statement page", () => {});
});
