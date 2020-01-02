const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allFile(filter: { name: { eq: "ODSCodes" } }) {
        edges {
          node {
            childDataJson {
              ODSCodes
            }
          }
        }
      }
    }
  `);
  const ODSCodes = result.data.allFile.edges[0].node.childDataJson.ODSCodes;

  ODSCodes.forEach(ODSCode => {
    createPage({
      path: `/practice/${ODSCode}`,
      component: path.resolve("src/templates/index.js"),
      context: {
        ODSCode,
      },
    });
  });
};
