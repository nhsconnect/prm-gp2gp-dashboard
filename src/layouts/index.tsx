import React, { useEffect, FC, ReactNode } from "react";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet";
import { Link } from "gatsby";
import classNames from "classnames";

import { CookieBanner } from "../components/CookieBanner";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FeedbackBanner } from "../components/FeedbackBanner";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { HeroBanner } from "../components/common/HeroBanner";
import { setupAnalytics } from "../library/setupAnalytics";
import { getEnv } from "../library/utils/getEnv";
import analytics from "../../analytics-config.json";
import { NHS_COOKIE_NAME } from "../library/constants";
import {
  FeatureTogglesContext,
  useFeatureToggles,
  useFetchFeatureToggles,
} from "../library/hooks/useFeatureToggle/";
import homepageContent from "../data/content/homepage.json";
import "./index.scss";
import { SkipLink } from "../components/SkipLink";

const trackingId =
  getEnv() === "dev" ? analytics.trackingId.dev : analytics.trackingId.prod;

type LayoutProps = {
  path: string;
  children: ReactNode;
  pageContext: {
    layout: "general" | "homepage" | "navigation-contents";
  };
};

type ContentProps = {
  children: ReactNode;
};

const HomepageContent: FC<ContentProps> = ({ children }) => (
  <>
    {/*keeping consistent with nhs.uk and their styling on the home page with the hero banner*/}
    <main className="nhsuk-main-wrapper app-homepage" id="maincontent">
      <HeroBanner
        title={homepageContent.title}
        subtitle={homepageContent.subtitle}
      />
      <section className="app-homepage-content">
        <div className="gp2gp-width-container">{children}</div>
      </section>
    </main>
  </>
);

const BackToLink = ({ text, link }: { text: string; link: string }) => (
  <nav className="nhsuk-breadcrumb gp2gp-nhsuk-breadcrumb">
    <ol className="nhsuk-breadcrumb__list">
      <li className="nhsuk-breadcrumb__item">
        <Link
          className="nhsuk-breadcrumb__link nhsuk-breadcrumb__list"
          to={link}
          data-testid="back-to-search__desktop"
        >
          {text}
        </Link>
      </li>
    </ol>

    <div className="nhsuk-breadcrumb__back">
      <Link
        className="nhsuk-breadcrumb__backlink"
        to={link}
        data-testid="back-to-search__mobile"
      >
        {text}
      </Link>
    </div>
  </nav>
);

const GeneralContent: FC<ContentProps> = ({ children }) => (
  <div className="gp2gp-width-container">
    <BackToLink link="/" text="Back to search" />
    <main className="nhsuk-main-wrapper nhsuk-u-padding-top-2" id="maincontent">
      {children}
      <FeedbackBanner />
    </main>
  </div>
);

const NavigationContents: FC<ContentProps> = ({ children }) => {
  const { showContentsNavigation } = useFeatureToggles();

  return (
    <div className="gp2gp-width-container">
      <BackToLink link="/" text="Back to search" />
      <main
        className="nhsuk-main-wrapper nhsuk-u-padding-top-2"
        id="maincontent"
      >
        {children}
        <FeedbackBanner
          className={classNames({
            "gp2gp-page-contents-feedback": showContentsNavigation,
          })}
        />
      </main>
    </div>
  );
};

const Layout: FC<LayoutProps> = ({ path, children, pageContext }) => {
  const [cookies] = useCookies([NHS_COOKIE_NAME]);
  const hasCookieConsent = cookies[NHS_COOKIE_NAME] === "true";
  const isOnCookiePage = path === "/cookies-policy/";

  const { toggles } = useFetchFeatureToggles();

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
      <FeatureTogglesContext.Provider value={toggles}>
        <ErrorBoundary>
          {!isOnCookiePage && <CookieBanner path={path} />}
          <SkipLink />
          <Header />
          {pageContext.layout === "homepage" ? (
            <HomepageContent>{children}</HomepageContent>
          ) : pageContext.layout === "navigation-contents" ? (
            <NavigationContents>{children}</NavigationContents>
          ) : (
            <GeneralContent>{children}</GeneralContent>
          )}
          <Footer />
        </ErrorBoundary>
      </FeatureTogglesContext.Provider>
    </>
  );
};

export default Layout;
