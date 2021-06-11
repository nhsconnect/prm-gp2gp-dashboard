const path = require("path");
const organisationMetadata = require("./src/data/organisations/organisationMetadata.json");

const practices = organisationMetadata.practices;
const ccgs = organisationMetadata.ccgs;

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
        validPractices: getPracticesForCcg(ccg.practices),
        layout: "general",
      },
    });
  });
};

const getPracticesForCcg = (practicesODsCodes) => {
  let ccgPractices = [];
  practicesODsCodes.map((practiceOds) => {
    practices.find((ccgPractice) => {
      if (ccgPractice.odsCode === practiceOds) {
        ccgPractices.push(ccgPractice);
      }
    });
  });

  return ccgPractices;
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
