const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allFile(filter: {name: {eq: "metrics"}}) {
        edges {
          node {
            childDataJson {
              practices {
                ods
                metrics {
                  year
                  month
                  requestor {
                    timeToIntegrateSla {
                      within3Days
                      within8Days
                      beyond8Days
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);
  const practices = result.data.allFile.edges[0].node.childDataJson.practices;

  practices.forEach(practice => {
    latestMetrics = practice.metrics[0]

    createPage({
      path: `/practice/${practice.ods}`,
      component: path.resolve("src/templates/practice.js"),
      context: {
        ODSCode: practice.ods,
        year: latestMetrics.year,
        month: latestMetrics.month,
        metrics: latestMetrics.requestor.timeToIntegrateSla
      },
    });
  });
};
