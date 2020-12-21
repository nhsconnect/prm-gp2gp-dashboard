import React from "react";
import { Helmet } from "react-helmet";
import Details from "../components/Details";

const CookiesPolicy = () => {
  return (
    <>
      <Helmet title="Cookies policy - GP2GP Service Dashboard" />
      <section>
        <h1>Cookie Policy</h1>
        <h2>What are cookies?</h2>
        <p>
          Cookies are files saved on your phone, tablet or computer when you
          visit a website.
        </p>
        <p>
          They store information about how you use the website, such as the
          pages you visit.
        </p>
        <p>
          Cookies are not viruses or computer programs. They are very small so
          do not take up much space.
        </p>
        <h2>How we use cookies</h2>
        <p>We only use cookies to:</p>
        <ul>
          <li>make our website work</li>
          <li>
            measure how you use our website, such as which links you click on
            (analytics cookies), if you give us permission
          </li>
        </ul>
        <p>
          We do not use any other cookies, for example, cookies that help with
          health campaigns.
        </p>
        <p>
          We sometimes use tools on other organisations' websites to collect
          data or to ask for feedback. These tools set their own cookies.
        </p>
        <Details
          summary="Cookies needed for this website to work"
          headers={["Cookie Name", "Purpose", "Expiry"]}
          rows={[
            [
              "nhsuk-cookie-consent",
              "Remembers if you used our cookies banner",
              "This cookie will not be set until you interact with the cookie banner. If you interact with the banner the cookie will expire after 3 months.",
            ],
          ]}
        />
      </section>
    </>
  );
};

export default CookiesPolicy;
