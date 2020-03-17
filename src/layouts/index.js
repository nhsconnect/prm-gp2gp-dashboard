import React, { Fragment } from "react";
import { useStaticQuery, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import Header from "../components/Header/index";
import "./index.scss";

const Layout = ({ children }) => {
  const serviceName = useStaticQuery(
    graphql`
      query {
        allFile(filter: { name: { eq: "header" } }) {
          edges {
            node {
              childContentJson {
                serviceName
              }
            }
          }
        }
      }
    `
  ).allFile.edges[0].node.childContentJson.serviceName;

  return (
    <Fragment>
      <Helmet>
        <html lang="en" />
        <title>{serviceName}</title>
      </Helmet>
      <Header />
      <div className="nhsuk-width-container">
        <main className="nhsuk-main-wrapper">{children}</main>
      </div>
    </Fragment>
  );
};

export default Layout;
