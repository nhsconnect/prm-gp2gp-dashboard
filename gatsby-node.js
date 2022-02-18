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
        odsCode: practice.odsCode,
        name: practice.name,
        layout: "general",
      },
    });

    createPage({
      path: `/practice/${practice.odsCode}/integration-times`,
      component: path.resolve(
        "src/templates/PracticeIntegrationTimes/index.tsx"
      ),
      context: {
        practice,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/practice/${practice.odsCode}/transfers-requested`,
      component: path.resolve(
        "src/templates/PracticeTransfersRequested/index.tsx"
      ),
      context: {
        practice,
        layout: "navigation-contents",
      },
    });
  });

  ccgs.forEach((ccg) => {
    const ccgPractices = filterPracticesByOdsCodes(ccg.practices, practices);

    createPage({
      path: `/ccg/${ccg.odsCode}`,
      component: path.resolve("src/templates/Ccg/index.tsx"),
      context: {
        odsCode: ccg.odsCode,
        name: ccg.name,
        layout: "general",
      },
    });

    createPage({
      path: `/ccg/${ccg.odsCode}/integration-times`,
      component: path.resolve("src/templates/CcgIntegrationTimes/index.tsx"),
      context: {
        odsCode: ccg.odsCode,
        name: ccg.name,
        ccgPractices,
        layout: "navigation-contents",
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
