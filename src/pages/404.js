import React from "react";
import { graphql } from "gatsby";

const NotFound = ({ data }) => {
  const { title, text } = data.allFile.edges[0].node.childDataJson;

  return (
    <React.Fragment>
      <h1>{title}</h1>
      <p>{text}</p>
    </React.Fragment>
  );
};

export const query = graphql`
  query {
    allFile(filter: { name: { eq: "404" } }) {
      edges {
        node {
          childDataJson {
            title
            text
          }
        }
      }
    }
  }
`;

export default NotFound;
