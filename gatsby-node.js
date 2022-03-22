const path = require("path");
const practiceMetrics = require("./src/data/organisations/practiceMetrics.json");
const filterPracticesByOdsCodes = require("./src/library/utils/filterPracticesByOdsCodes/index.js");

const practices = practiceMetrics.practices;
const ccgs = practiceMetrics.ccgs;
const dataUpdatedDate = practiceMetrics.generatedOn;

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
        practiceOdsCode: practice.odsCode,
        dataUpdatedDate,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/practice/${practice.odsCode}/gp2gp-transfers-requested`,
      component: path.resolve(
        "src/templates/TransfersRequested/PracticeTransfersRequested/index.tsx"
      ),
      context: {
        practiceOdsCode: practice.odsCode,
        dataUpdatedDate,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/practice/${practice.odsCode}/download-data`,
      component: path.resolve(
        "src/templates/DownloadData/PracticeDownloadData/index.tsx"
      ),
      context: {
        practiceOdsCode: practice.odsCode,
        layout: "navigation-contents",
        dataUpdatedDate,
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
        dataUpdatedDate,
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
        dataUpdatedDate,
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
        dataUpdatedDate,
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

function practiceResolver(args, practices) {
  if (args.practiceOdsCode)
    return practices.filter(
      (practice) => practice.odsCode === args.practiceOdsCode
    );
  if (args.ccgOdsCode) {
    return practices.filter(
      (practice) => practice.ccgOdsCode === args.ccgOdsCode
    );
  }
  return practices;
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    OrganisationsJson: {
      practices: {
        type: ["OrganisationsJsonPractices"],
        args: { practiceOdsCode: "String", ccgOdsCode: "String" },
        resolve: async (root, args, context, info) => {
          const practices =
            (await info.originalResolver(root, args, context, info)) || [];
          return practiceResolver(args, practices);
        },
      },
      ccgs: {
        type: ["OrganisationsJsonCcgs"],
        args: { ccgOdsCode: "String" },
        resolve: async (root, args, context, info) => {
          const ccgs =
            (await info.originalResolver(root, args, context, info)) || [];
          return args.ccgOdsCode
            ? ccgs.filter((ccg) => ccg.odsCode === args.ccgOdsCode)
            : ccgs;
        },
      },
    },
  });
};
