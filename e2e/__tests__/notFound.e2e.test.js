xdescribe("Not found page", () => {
  it("displays 404 not found page", () => {
    cy.visit("/some-page", { failOnStatusCode: false });
    //dev and prod display different content
    cy.contains(/not found| 404 page/g);
  });

  it("displays the feedback section that links to feedback survey", () => {
    cy.contains("h3", "Feedback");
    cy.contains("Take our survey").click();
    cy.contains("Feedback form for GP registrations data platform");
  });
});
