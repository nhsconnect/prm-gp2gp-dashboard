describe("National Statistics Page", () => {
  const viewPorts = [
    { device: "Desktop", width: 1280, height: 720 },
    { device: "Mobile", width: 320, height: 480 },
  ];

  viewPorts.map(viewPort => {
    describe(`${viewPort.device} viewport`, () => {
      beforeEach(() => {
        cy.viewport(viewPort.width, viewPort.height);
        cy.visit("/national-gp2gp-statistics");
        cy.injectAxe();
      });

      it("displays national metrics contents", () => {
        cy.contains("h1", "National data on GP2GP performance");

        cy.contains("h3", "Total number of transfers initiated");
        cy.get('[data-testid="national-statistics__initiated-count"]').contains(
          /^(Count: (.+))$/
        );

        cy.contains("h3", "Successfully integrated records");
        cy.get(
          '[data-testid="national-statistics__integrated-count"]'
        ).contains(/^(Count: (.+))$/);
        cy.get(
          '[data-testid="national-statistics__integrated-percent"]'
        ).contains(/^(Percent: (.+)%)$/);

        cy.contains("h3", "SLA Bandings/Metrics");
        cy.contains("within 3 days");
        cy.get('[data-testid="table__cell--row-0-col-0"]').contains(/.+/g);
        cy.contains("within 8 days");
        cy.get('[data-testid="table__cell--row-0-col-1"]').contains(/.+/g);
        cy.contains("beyond 8 days");
        cy.get('[data-testid="table__cell--row-0-col-2"]').contains(/.+/g);

        cy.contains("h3", "Total paper fallback rate");
        cy.get(
          '[data-testid="national-statistics__paper-fallback-count"]'
        ).contains(/^(Count: (.+))$/);
        cy.get(
          '[data-testid="national-statistics__paper-fallback-percent"]'
        ).contains(/^(Percent: (.+)%)$/);

        cy.contains("h3", "Failed transfers");
        cy.get('[data-testid="national-statistics__failed-count"]').contains(
          /^(Count: (.+))$/
        );
        cy.get('[data-testid="national-statistics__failed-percent"]').contains(
          /^(Percent: (.+)%)$/
        );

        cy.contains("h3", "Pending transfers");
        cy.get('[data-testid="national-statistics__pending-count"]').contains(
          /^(Count: (.+))$/
        );
        cy.get('[data-testid="national-statistics__pending-percent"]').contains(
          /^(Percent: (.+)%)$/
        );

        cy.checkAccessibility();
      });
    });
  });
});
