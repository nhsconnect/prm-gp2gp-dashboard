import React, { useEffect, FC, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet";

import CookieBanner from "../components/CookieBanner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FeedbackBanner from "../components/FeedbackBanner";
import { ErrorBoundary } from "../components/ErrorBoundary";
import "./index.scss";
import { setupAnalytics } from "../library/setupAnalytics";
import getEnv from "../library/utils/getEnv";
import analytics from "../../analytics-config.json";
import { NHS_COOKIE_NAME } from "../library/constants";
import { useFeatureToggle } from "../library/hooks/useFeatureToggle";

const trackingId =
  getEnv() === "dev" ? analytics.trackingId.dev : analytics.trackingId.prod;

type LayoutProps = {
  path: string;
  childeren: ReactNode;
};

const Layout: FC<LayoutProps> = ({ path, children }) => {
  const [cookies] = useCookies([NHS_COOKIE_NAME]);
  const hasCookieConsent = cookies[NHS_COOKIE_NAME] === "true";
  const isOnCookiePage = path === "/cookies-policy/";
  const isOnHomePage = path === "/";

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
        {!isOnCookiePage && <CookieBanner path={path} />}
        <Header />
        <div className="nhsuk-width-container">
          <main className="nhsuk-main-wrapper">
            {!isOnHomePage && <FeedbackBanner />}
            {children}
            {isOnHomePage && <FeedbackBanner />}
          </main>
        </div>
        <Footer />
      </ErrorBoundary>
    </>
  );
};

export default Layout;
