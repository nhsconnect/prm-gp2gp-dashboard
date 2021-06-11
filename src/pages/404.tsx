import React, { FC } from "react";
import { Helmet } from "react-helmet";

const NotFound: FC = () => {
  return (
    <>
      <Helmet>
        <title>Page not found.</title>
        <meta
          name="description"
          content="The page you are looking for on the GP Registrations Data Platform cannot be found."
        />
      </Helmet>
      <div className="nhsuk-u-reading-width">
        <h1>Page not found.</h1>
        <p>If you entered a web address please check it was correct.</p>
      </div>
    </>
  );
};
export default NotFound;
