import React, { useEffect, useState, FC, ReactNode } from "react";
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
import HeroBanner from "../components/HeroBanner";
import homepageContent from "../data/content/homepage.json";

const trackingId =
  getEnv() === "dev" ? analytics.trackingId.dev : analytics.trackingId.prod;

type LayoutProps = {
  path: string;
  children: ReactNode;
  pageContext: {
    layout: "general" | "homepage";
  };
};

type ContentProps = {
  children: ReactNode;
};

const HomepageContent: FC<ContentProps> = ({ children }) => (
  <>
    <HeroBanner
      title={homepageContent.title}
      subtitle={homepageContent.subtitle}
    />
    <div className="nhsuk-width-container">
      <main className="nhsuk-main-wrapper">
        {children}
        <FeedbackBanner />
      </main>
    </div>
  </>
);

const GeneralContent: FC<ContentProps> = ({ children }) => (
  <div className="nhsuk-width-container">
    <main className="nhsuk-main-wrapper">
      <FeedbackBanner />
      {children}
    </main>
  </div>
);

const Layout: FC<LayoutProps> = ({ path, children, pageContext }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [cookies] = useCookies([NHS_COOKIE_NAME]);
  const hasCookieConsent = cookies[NHS_COOKIE_NAME] === "true";
  const isOnCookiePage = path === "/cookies-policy/";

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setupAnalytics({
      hasConsent: hasCookieConsent,
      trackingId,
    });
  }, [hasCookieConsent]);

  if (!hasMounted) {
    return null;
  }

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
        {pageContext.layout === "homepage" ? (
          <HomepageContent>{children}</HomepageContent>
        ) : (
          <GeneralContent>{children}</GeneralContent>
        )}
        <Footer />
      </ErrorBoundary>
    </>
  );
};

export default Layout;
