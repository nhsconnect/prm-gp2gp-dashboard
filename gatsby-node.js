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
      component: path.resolve(
        "src/templates/RedirectNotice/Practice/index.tsx"
      ),
      context: {
        odsCode: practice.odsCode,
        name: practice.name,
        layout: "general",
      },
    });

    createPage({
      path: `/practice/${practice.odsCode}/integration-times`,
      component: path.resolve(
        "src/templates/IntegrationTimes/PracticeIntegrationTimes/index.tsx"
      ),
      context: {
        practice,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/practice/${practice.odsCode}/gp2gp-transfers-requested`,
      component: path.resolve(
        "src/templates/TransfersRequested/PracticeTransfersRequested/index.tsx"
      ),
      context: {
        practice,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/practice/${practice.odsCode}/download-data`,
      component: path.resolve(
        "src/templates/DownloadData/PracticeDownloadData/index.tsx"
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
      component: path.resolve("src/templates/RedirectNotice/Ccg/index.tsx"),
      context: {
        odsCode: ccg.odsCode,
        name: ccg.name,
        layout: "general",
      },
    });

    createPage({
      path: `/ccg/${ccg.odsCode}/integration-times`,
      component: path.resolve(
        "src/templates/IntegrationTimes/CcgIntegrationTimes/index.tsx"
      ),
      context: {
        odsCode: ccg.odsCode,
        name: ccg.name,
        ccgPractices,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/ccg/${ccg.odsCode}/gp2gp-transfers-requested`,
      component: path.resolve(
        "src/templates/TransfersRequested/CcgTransfersRequested/index.tsx"
      ),
      context: {
        odsCode: ccg.odsCode,
        name: ccg.name,
        ccgPractices,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/ccg/${ccg.odsCode}/download-data`,
      component: path.resolve(
        "src/templates/DownloadData/CcgDownloadData/index.tsx"
      ),
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
