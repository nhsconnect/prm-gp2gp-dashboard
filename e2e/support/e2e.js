import "@testing-library/cypress/add-commands";
import "cypress-axe";

// function printAccessibilityViolations(violations) {
//     cy.task(
//         "table",
//         violations.map(({ id, impact, description, nodes }) => ({
//             impact,
//             description: `${description} (${id})`,
//             nodes: nodes.length,
//         }))
//     );
// }
//
// Cypress.Commands.add(
//     "checkA11y",
//     {
//         prevSubject: "optional",
//     },
//     (subject, { skipFailures = true } = {}) => {
//         cy.checkA11y(subject, null, printAccessibilityViolations, skipFailures);
//     }
// );
