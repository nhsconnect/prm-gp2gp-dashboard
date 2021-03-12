const path = require("path");
const organisationMetadata = require("./src/data/organisations/organisationMetadata.json");
const practiceMetrics = require("./src/data/organisations/practiceMetrics.json");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const practices = practiceMetrics.practices;
  const ccgs = organisationMetadata.ccgs;

  practices.forEach(practice => {
    createPage({
      path: `/practice/${practice.odsCode}`,
      component: path.resolve("src/templates/Practice/index.tsx"),
      context: {
        practice,
        layout: "general",
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
        layout: "general",
      },
    });
  });
};

exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions;

  const layout = page.path === "/" ? "homepage" : "general";

  createPage({
    ...page,
    context: {
      ...page.context,
      layout,
    },
  });
};
