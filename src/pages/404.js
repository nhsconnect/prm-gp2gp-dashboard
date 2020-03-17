import React, { Fragment } from "react";
import { graphql } from "gatsby";

const NotFound = ({ data }) => {
  const { title, text } = data.allFile.edges[0].node.childContentJson;

  return (
    <Fragment>
      <h1>{title}</h1>
      <p>{text}</p>
    </Fragment>
  );
};

export const query = graphql`
  query {
    allFile(filter: { name: { eq: "404" } }) {
      edges {
        node {
          childContentJson {
            title
            text
          }
        }
      }
    }
  }
`;

export default NotFound;
