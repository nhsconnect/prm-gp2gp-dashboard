import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";

const CookieConfirmation: FC = () => {
  return (
    <>
      <Helmet>
        <title>
          Your cookie settings have been saved - GP Registrations Data Platform
        </title>
        <meta
          name="description"
          content="Cookie settings confirmation page for the GP Registrations Data Platform"
        />
      </Helmet>

      <div className="nhsuk-u-reading-width">
        <h1>Your cookie settings have been saved</h1>
        <p>We'll save your settings for three months.</p>
        <p>
          We'll ask you if you're still OK with us using cookies when either:
        </p>
        <ul>
          <li>it's been three months since you last saved your settings</li>
          <li>we add any new cookies or change the cookies we use</li>
        </ul>
        <p>
          You can also{" "}
          <Link to="/cookies-policy">choose which cookies we use</Link> at any
          time.
        </p>
      </div>
    </>
  );
};

export default CookieConfirmation;
