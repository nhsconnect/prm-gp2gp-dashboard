import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet";

import CookieBanner from "../components/CookieBanner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./index.scss";
import { useFeatureToggle } from "../library/hooks/useFeatureToggle";
import { setupAnalytics } from "../library/setupAnalytics/";

const trackingId = process.env.DEPLOYMENT_ENV === "dev" ? "G-X6RDS1EV0Q" : "";

const Layout = ({ path, children }) => {
  const isCookieBannerOn = useFeatureToggle("F_COOKIE_BANNER_AND_FOOTER");
  const [cookies] = useCookies(["nhsuk-cookie-consent"]);
  const hasCookieConsent = cookies["nhsuk-cookie-consent"] === "true";

  useEffect(() => {
    setupAnalytics({
      hasConsent: hasCookieConsent,
      trackingId,
    });
  }, [hasCookieConsent]);

  return (
    <>
      <Helmet>
        <html lang="en" />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
        ></script>
      </Helmet>
      {isCookieBannerOn && <CookieBanner path={path} />}
      <Header />
      <div className="nhsuk-width-container">
        <main className="nhsuk-main-wrapper">{children}</main>
      </div>
      {isCookieBannerOn && <Footer />}
    </>
  );
};

export default Layout;
