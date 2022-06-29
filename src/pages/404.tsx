import React, { FC } from "react";
import { Helmet } from "react-helmet";

const NotFound: FC = () => {
  return (
    <>
      <Helmet>
        <title>Page not found.</title>
        <meta
          name="description"
          content="This page may have been moved. You can find ICBs and practices using the Homepage - search."
        />
      </Helmet>
      <h1>Page not found.</h1>
      <p>
        This page may have been moved. You can find ICBs and practices using the{" "}
        <a href="/">Homepage - search</a>.
      </p>
    </>
  );
};
export default NotFound;
