const path = require("path");
const organisationMetadata = require("./src/data/organisations/organisationMetadata.json");
const practiceMetrics = require("./src/data/organisations/practiceMetrics.json");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const practices = practiceMetrics.practices;
  const ccgs = organisationMetadata.ccgs;

  practices.forEach(practice => {
    latestMetrics = practice.metrics[0];

    createPage({
      path: `/practice/${practice.odsCode}`,
      component: path.resolve("src/templates/practice.js"),
      context: {
        odsCode: practice.odsCode,
        name: practice.name,
        year: latestMetrics.year,
        month: latestMetrics.month,
        metrics: latestMetrics.requester.timeToIntegrateSla,
      },
    });
  });

  ccgs.forEach(ccg => {
    createPage({
      path: `/ccg/${ccg.odsCode}`,
      component: path.resolve("src/templates/ccg.tsx"),
      context: {
        odsCode: ccg.odsCode,
        name: ccg.name,
        validPractices: practiceMetrics.practices,
      },
    });
  });
};
