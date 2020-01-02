module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-s3",
      options: {
        bucketName: "prm-gp2gp-dashboard-dev",
        region: "eu-west-2",
      },
    },
    "gatsby-plugin-sass",
    "gatsby-plugin-layout",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/
        }
      }
    }
  ]
}
