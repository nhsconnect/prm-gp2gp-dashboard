const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const pageData = await graphql(`
    query {
      allFile(filter: { name: { eq: "practiceMetrics" } }) {
        edges {
          node {
            childOrganisationsJson {
              sicbls {
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

  const { practices, sicbls, generatedOn } =
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
      },
    });

    createPage({
      path: `/practice/${practice.odsCode}/download-data`,
      component: path.resolve(
        "src/templates/DownloadData/PracticeDownloadData/index.tsx"
      ),
      context: {
        practiceOdsCode: practice.odsCode,
        dataUpdatedDate: generatedOn,
      },
    });
  });

  sicbls.forEach((sicbl) => {
    createPage({
      path: `/sub-ICB-location/${sicbl.odsCode}/integration-times`,
      component: path.resolve(
        "src/templates/IntegrationTimes/SICBLIntegrationTimes/index.tsx"
      ),
      context: {
        sicblOdsCode: sicbl.odsCode,
        dataUpdatedDate: generatedOn,
      },
    });

    createPage({
      path: `/sub-ICB-location/${sicbl.odsCode}/gp2gp-transfers-requested`,
      component: path.resolve(
        "src/templates/TransfersRequested/SICBLTransfersRequested/index.tsx"
      ),
      context: {
        sicblOdsCode: sicbl.odsCode,
        dataUpdatedDate: generatedOn,
      },
    });

    createPage({
      path: `/sub-ICB-location/${sicbl.odsCode}/download-data`,
      component: path.resolve(
        "src/templates/DownloadData/SICBLDownloadData/index.tsx"
      ),
      context: {
        sicblOdsCode: sicbl.odsCode,
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
  if (args.sicblOdsCode) {
    return practices.filter(
      (practice) => practice.sicblOdsCode === args.sicblOdsCode
    );
  }
  return practices;
}

exports.createResolvers = ({ createResolvers }) => {
  createResolvers({
    OrganisationsJson: {
      practices: {
        type: ["OrganisationsJsonPractices"],
        args: { practiceOdsCode: "String", sicblOdsCode: "String" },
        resolve: async (root, args, context, info) => {
          const practices =
            (await info.originalResolver(root, args, context, info)) || [];
          return practiceResolver(args, practices);
        },
      },
      sicbls: {
        type: ["OrganisationsJsonSicbls"],
        args: { sicblOdsCode: "String" },
        resolve: async (root, args, context, info) => {
          const sicbls =
            (await info.originalResolver(root, args, context, info)) || [];
          return args.sicblOdsCode
            ? sicbls.filter((sicbl) => sicbl.odsCode === args.sicblOdsCode)
            : sicbls;
        },
      },
    },
  });
};
