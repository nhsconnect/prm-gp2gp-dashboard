const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const pageData = await graphql(`
    query {
      allFile(filter: { name: { eq: "practiceMetrics" } }) {
        edges {
          node {
            childOrganisationsJson {
              icbs {
                odsCode
                name
              }
              practices {
                odsCode
                name
              }
              generatedOn
            }
          }
        }
      }
    }
  `);

  const { practices, icbs, generatedOn } =
    pageData.data.allFile.edges[0].node.childOrganisationsJson;

  practices.forEach((practice) => {
    createPage({
      path: `/practice/${practice.odsCode}/integration-times`,
      component: path.resolve(
        "src/templates/IntegrationTimes/PracticeIntegrationTimes/index.tsx"
      ),
      context: {
        practiceOdsCode: practice.odsCode,
        dataUpdatedDate: generatedOn,
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
        dataUpdatedDate: generatedOn,
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
        dataUpdatedDate: generatedOn,
      },
    });
  });

  icbs.forEach((icb) => {
    createPage({
      path: `/icb/${icb.odsCode}/integration-times`,
      component: path.resolve(
        "src/templates/IntegrationTimes/ICBIntegrationTimes/index.tsx"
      ),
      context: {
        icbOdsCode: icb.odsCode,
        dataUpdatedDate: generatedOn,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/icb/${icb.odsCode}/gp2gp-transfers-requested`,
      component: path.resolve(
        "src/templates/TransfersRequested/ICBTransfersRequested/index.tsx"
      ),
      context: {
        icbOdsCode: icb.odsCode,
        dataUpdatedDate: generatedOn,
        layout: "navigation-contents",
      },
    });

    createPage({
      path: `/icb/${icb.odsCode}/download-data`,
      component: path.resolve(
        "src/templates/DownloadData/ICBDownloadData/index.tsx"
      ),
      context: {
        icbOdsCode: icb.odsCode,
        layout: "navigation-contents",
        dataUpdatedDate: generatedOn,
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
  if (args.icbOdsCode) {
    return practices.filter(
      (practice) => practice.icbOdsCode === args.icbOdsCode
    );
  }
  return practices;
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    OrganisationsJson: {
      practices: {
        type: ["OrganisationsJsonPractices"],
        args: { practiceOdsCode: "String", icbOdsCode: "String" },
        resolve: async (root, args, context, info) => {
          const practices =
            (await info.originalResolver(root, args, context, info)) || [];
          return practiceResolver(args, practices);
        },
      },
      icbs: {
        type: ["OrganisationsJsonIcbs"],
        args: { icbOdsCode: "String" },
        resolve: async (root, args, context, info) => {
          const icbs =
            (await info.originalResolver(root, args, context, info)) || [];
          return args.icbOdsCode
            ? icbs.filter((icb) => icb.odsCode === args.icbOdsCode)
            : icbs;
        },
      },
    },
  });
};
