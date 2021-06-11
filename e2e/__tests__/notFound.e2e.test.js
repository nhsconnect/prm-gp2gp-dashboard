describe("Not found page", () => {
  it("displays 404 not found page", () => {
    cy.visit("/some-page", { failOnStatusCode: false });
    //dev and prod display different content
    cy.contains(/not found| 404 page/g);
  });

  it("contains the title and description metadata for the not found page", () => {
    cy.visit("/some-page", { failOnStatusCode: false });
    cy.title().should("eq", "Page not found.");
    cy.get('meta[name="description"]').should(
      "have.attr",
      "content",
      "The page you are looking for on the GP Registrations Data Platform cannot be found."
    );
  });
});
