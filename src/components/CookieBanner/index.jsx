import React, { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { Link } from "gatsby";
import "./index.scss";
import cookieBannerContent from "../../data/content/cookieBanner.json";
import { getCookieExpiryDate } from "../../library/utils/getCookieExpiryDate";
import { NHS_COOKIE_NAME } from "../../library/constants";
import Button from "../Button";

const AcceptCookies = ({ handleAgree, handleDisagree }) => (
  <div aria-label="Cookie banner" className="gp2gp-cookie-banner">
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

const CookieBanner = ({ path }) => {
  const [cookies, setCookie] = useCookies([NHS_COOKIE_NAME]);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const successBannerRef = useCallback(node => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  useEffect(() => {
    setIsClicked(false);
    setIsLoading(false);
  }, [path]);

  const setCookieConsent = consent => {
    const expiryDate = getCookieExpiryDate();
    setCookie(NHS_COOKIE_NAME, consent, {
      expires: expiryDate,
    });
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
          aria-label="Cookie setting success banner"
        >
          <div className="nhsuk-width-container">
            <p ref={successBannerRef} tabIndex={-1}>
              You can change your cookie settings at any time using our{" "}
              <Link to="/cookies-policy">cookies page</Link>.
            </p>
          </div>
        </div>
      )}
      {!cookies[NHS_COOKIE_NAME] && !isLoading ? (
        <AcceptCookies
          handleAgree={handleAgree}
          handleDisagree={handleDisagree}
        />
      ) : null}
    </>
  );
};

export default CookieBanner;
