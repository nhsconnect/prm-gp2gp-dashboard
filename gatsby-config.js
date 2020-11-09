module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-s3",
      options: {
        bucketName: `prm-gp2gp-dashboard-${process.env.DEPLOYMENT_ENV}`,
        region: "eu-west-2",
        parallelLimit: 1000,
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/,
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/src/data/content`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "practices",
        path: `${__dirname}/src/data/organisations`,
      },
    },
    "gatsby-plugin-sass",
    "gatsby-plugin-layout",
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-json",
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        isTSX: true,
        jsxPragma: `jsx`,
        allExtensions: true,
      },
    },
  ],
};
