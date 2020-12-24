import React, { Fragment } from "react";
import content from "../data/content/404.json";

const NotFound = () => {
  return (
    <Fragment>
      <h1>{content.title}</h1>
      <p>{content.text}</p>
    </Fragment>
  );
};

export default NotFound;
