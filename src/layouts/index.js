import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet";

import CookieBanner from "../components/CookieBanner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ErrorBoundary } from "../components/ErrorBoundary";
import "./index.scss";
import { useFeatureToggle } from "../library/hooks/useFeatureToggle";
import { setupAnalytics } from "../library/setupAnalytics/";
import getEnv from "../library/utils/getEnv";
import analytics from "../../analytics-config.json";
import { NHS_COOKIE_NAME } from "../library/constants";

const trackingId =
  getEnv() === "dev" ? analytics.trackingId.dev : analytics.trackingId.prod;

const Layout = ({ path, children }) => {
  const isCookieBannerOn = useFeatureToggle("F_COOKIE_BANNER_AND_FOOTER");
  const [cookies] = useCookies([NHS_COOKIE_NAME]);
  const hasCookieConsent = cookies[NHS_COOKIE_NAME] === "true";

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
      <ErrorBoundary>
        {isCookieBannerOn && <CookieBanner path={path} />}
        <Header />
        <div className="nhsuk-width-container">
          <main className="nhsuk-main-wrapper">{children}</main>
        </div>
        {isCookieBannerOn && <Footer />}
      </ErrorBoundary>
    </>
  );
};

export default Layout;
