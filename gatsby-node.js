const path = require("path");
const organisationMetadata = require("./src/data/organisations/organisationMetadata.json");
const practiceMetrics = require("./src/data/organisations/practiceMetrics.json");
const featureToggles = require("./flags.json");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const practices = practiceMetrics.practices;
  const ccgs = organisationMetadata.ccgs;

  practices.forEach(practice => {
    const latestMetrics = practice.metrics[0];
    const isPracticeIntegratedTransferCountOn =
      featureToggles["F_PRACTICE_INTEGRATED_TRANSFER_COUNT"][
        process.env.GATSBY_ENV || "dev"
      ];

    createPage({
      path: `/practice/${practice.odsCode}`,
      component: path.resolve("src/templates/practice.tsx"),
      context: {
        odsCode: practice.odsCode,
        name: practice.name,
        year: latestMetrics.year,
        month: latestMetrics.month,
        metrics: isPracticeIntegratedTransferCountOn
          ? latestMetrics.requester.integrated
          : latestMetrics.requester.timeToIntegrateSla,
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
