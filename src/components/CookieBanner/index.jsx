import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { addMonths } from "date-fns";
import cookieBannerContent from "../../data/content/cookieBanner.json";
import Button from "../Button";
import "./index.scss";
import { Link } from "gatsby";

const AcceptCookies = ({ handleAgree, handleDisagree }) => (
  <div aria-label="Accept cookies" className="gp2gp-cookie-banner">
    <div className="nhsuk-width-container">
      <h2 className="nhsuk-heading-s">{cookieBannerContent.heading}</h2>
      <p>{cookieBannerContent.text1}</p>
      <p>{cookieBannerContent.text2}</p>
      <p>
        {cookieBannerContent.text3} You can{" "}
        <Link to="/cookies-policy">read more about our cookies</Link> before you
        choose.
      </p>
      <Button className="nhsuk-u-margin-right-4" onClick={handleAgree}>
        {cookieBannerContent.agreeButton}
      </Button>
      <Button onClick={handleDisagree}>
        {cookieBannerContent.disagreeButton}
      </Button>
    </div>
  </div>
);

const CookieBanner = () => {
  const [cookies, setCookie] = useCookies(["nhsuk-cookie-consent"]);
  const [isClicked, setIsClicked] = useState(false);

  const setCookieConsent = consent => {
    const expiryDate = addMonths(new Date(Date.now()), 3);
    setCookie("nhsuk-cookie-consent", consent, { expires: expiryDate });
  };

  const handleAgree = () => {
    setCookieConsent("true");
    setIsClicked(true);
  };

  const handleDisagree = () => {
    setCookieConsent("false");
    setIsClicked(true);
  };

  return (
    <>
      {isClicked && (
        <div
          className="gp2gp-success-banner"
          aria-label="Cookie setting success"
        >
          <div className="nhsuk-width-container">
            <p>
              You can change your cookie settings at any time using our{" "}
              <Link to="/cookies-policy">cookies page</Link>.
            </p>
          </div>
        </div>
      )}
      {!cookies["nhsuk-cookie-consent"] ? (
        <AcceptCookies
          handleAgree={handleAgree}
          handleDisagree={handleDisagree}
        />
      ) : null}
    </>
  );
};

export default CookieBanner;
