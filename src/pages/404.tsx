import React, { FC } from "react";
import { Helmet } from "react-helmet";

const NotFound: FC = () => {
  return (
    <>
      <Helmet>
        <title>Page not found.</title>
        <meta
          name="description"
          content="The page you are looking for on GP Registrations Data cannot be found."
        />
      </Helmet>
      <h1>Page not found.</h1>
      <p>If you entered a web address please check it was correct.</p>
    </>
  );
};
export default NotFound;
