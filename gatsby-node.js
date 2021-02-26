const path = require("path");
const organisationMetadata = require("./src/data/organisations/organisationMetadata.json");
const practiceMetrics = require("./src/data/organisations/practiceMetrics.json");
const nationalMetrics = require("./src/data/organisations/nationalMetrics.json");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const practices = practiceMetrics.practices;
  const ccgs = organisationMetadata.ccgs;

  practices.forEach(practice => {
    const latestMetrics = practice.metrics[0];

    createPage({
      path: `/practice/${practice.odsCode}`,
      component: path.resolve("src/templates/Practice/index.tsx"),
      context: {
        odsCode: practice.odsCode,
        name: practice.name,
        year: latestMetrics.year,
        month: latestMetrics.month,
        metrics: latestMetrics.requester,
      },
    });
  });

  ccgs.forEach(ccg => {
    createPage({
      path: `/ccg/${ccg.odsCode}`,
      component: path.resolve("src/templates/Ccg/index.tsx"),
      context: {
        odsCode: ccg.odsCode,
        name: ccg.name,
        validPractices: practiceMetrics.practices,
      },
    });
  });

  const latestNationalMetrics = nationalMetrics.metrics[0];

  createPage({
    path: "/national-gp2gp-statistics",
    component: path.resolve("src/templates/NationalStatistics/index.tsx"),
    context: {
      ...latestNationalMetrics,
    },
  });
};
