import React from "react";
import { useCookies } from "react-cookie";
import cookieBannerContent from "../../data/content/cookieBanner.json";
import Button from "../Button";

const CookieBanner = () => {
  const [cookies, setCookie] = useCookies(["nhsuk-cookie-consent"]);

  const handleAgree = () => {
    setCookie("nhsuk-cookie-consent", "true");
  };

  return !cookies["nhsuk-cookie-consent"] ? (
    <div aria-label="Accept cookies">
      <Button onClick={handleAgree}>{cookieBannerContent.agreeButton}</Button>
    </div>
  ) : null;
};

export default CookieBanner;
