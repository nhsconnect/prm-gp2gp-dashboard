xdescribe("Not found page", () => {
  it("displays 404 not found page", () => {
    cy.visit("/some-page", { failOnStatusCode: false });
    //dev and prod display different content
    cy.contains(/not found| 404 page/g);
  });
});
