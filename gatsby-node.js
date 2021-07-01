const path = require("path");
const practiceMetrics = require("./src/data/organisations/practiceMetrics.json");
const filterPracticesByOdsCodes = require("./src/library/utils/filterPracticesByOdsCodes/index.js");

const practices = practiceMetrics.practices;
const ccgs = practiceMetrics.ccgs;

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  practices.forEach((practice) => {
    createPage({
      path: `/practice/${practice.odsCode}`,
      component: path.resolve("src/templates/Practice/index.tsx"),
      context: {
        practice,
        layout: "general",
      },
    });
  });

  ccgs.forEach((ccg) => {
    createPage({
      path: `/ccg/${ccg.odsCode}`,
      component: path.resolve("src/templates/Ccg/index.tsx"),
      context: {
        odsCode: ccg.odsCode,
        name: ccg.name,
        ccgPractices: filterPracticesByOdsCodes(ccg.practices, practices),
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
