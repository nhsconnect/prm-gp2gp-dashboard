import React, { FC } from "react";
import { Helmet } from "react-helmet";
import { useCookies } from "react-cookie";
import Details from "../components/Details";
import Radios from "../components/Radios";
import { getCookieExpiryDate } from "../library/utils/getCookieExpiryDate";
import { NHS_COOKIE_NAME } from "../library/constants";

const CookiesPolicy: FC = () => {
  const [cookies, setCookie] = useCookies([NHS_COOKIE_NAME]);

  const saveCookieSettings = (value: string) => {
    const expiryDate = getCookieExpiryDate();
    setCookie(NHS_COOKIE_NAME, value, {
      expires: expiryDate,
    });
  };

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
              NHS_COOKIE_NAME,
              "Remembers if you used our cookies banner",
              "This cookie will not be set until you interact with the cookie banner. If you interact with the banner the cookie will expire after 3 months.",
            ],
          ]}
        />
        <h2>Cookies that measure website use</h2>
        <p>
          We also like to use analytics cookies. These cookies store anonymous
          information about how you use our website, such as which pages you
          visit or what you click on.
        </p>
        <Details
          summary="List of cookies that measure website use"
          headers={["Cookie Name", "Purpose", "Expiry"]}
          rows={[
            [
              "_ga",
              "Used by Google Analytics. Tells us how you use our website.",
              "2 years",
            ],
            [
              "_gid",
              "Used by Google Analytics. Tells us how you use our website.",
              "1 day",
            ],
            [
              "_ga_<container-id>",
              "Used by Google Analytics. Persists session state.",
              "3 months",
            ],
          ]}
        />
        <p>
          We'll only use these cookies if you say it's OK. We'll use a cookie to
          save your settings.
        </p>
        <Radios
          title="Tell us if we can use analytics cookies"
          options={[
            {
              displayValue: "Use cookies to measure my website use",
              value: "true",
            },
            {
              displayValue: "Do not use cookies to measure my website use",
              value: "false",
            },
          ]}
          linkLabel="Save my cookie settings"
          redirectURL="/cookie-confirmation"
          callback={saveCookieSettings}
          defaultValue={
            cookies[NHS_COOKIE_NAME] ? cookies[NHS_COOKIE_NAME] : "false"
          }
        />
      </section>
    </>
  );
};

export default CookiesPolicy;
