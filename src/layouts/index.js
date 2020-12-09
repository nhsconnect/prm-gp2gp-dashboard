import React from "react";
import { Helmet } from "react-helmet";
import CookieBanner from "../components/CookieBanner";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./index.scss";
import { useFeatureToggle } from "../library/hooks/useFeatureToggle";

const Layout = ({ children }) => {
  const isCookieBannerOn = useFeatureToggle("F_COOKIE_BANNER");

  return (
    <>
      <Helmet>
        <html lang="en" />
      </Helmet>
      {isCookieBannerOn && <CookieBanner />}
      <Header />
      <div className="nhsuk-width-container">
        <main className="nhsuk-main-wrapper">{children}</main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
