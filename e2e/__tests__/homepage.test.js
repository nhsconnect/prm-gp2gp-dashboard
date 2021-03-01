describe("Homepage", () => {
  it("should navigate to an individual practice page and show total integration count", () => {
    cy.visit("/");

    cy.contains("Search");
    cy.contains("Tell us what you think");
    cy.contains("Do not use analytics cookies").click();

    cy.get("[data-testid='gp2gp-practice-search__input']").type("bolton");
    //"Enter an ODS code, practice name or Clinical Commissioning Group (CCG) name"
    cy.get("#react-autowhatever-1-section-0-item-0").click();
    cy.get("[data-testid='gp2gp-practice-search__button']").click();

    cy.contains("Total successful integrations");
    cy.contains("67");
    cy.contains("Bolton Community Practice | Y03079").click();

    cy.contains("Waters Meeting Health Centre");
    cy.contains("Waters Meeting Road");
    cy.contains("Bolton");
    cy.contains("BL1 8TT");
    cy.contains("Total successful integrations");
    cy.contains("67");
  });
});
