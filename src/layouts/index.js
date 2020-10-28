import React from "react";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import "./index.scss";

const Layout = ({ children }) => {
  return (
    <>
      <Helmet>
        <html lang="en" />
      </Helmet>
      <Header />
      <div className="nhsuk-width-container">
        <main className="nhsuk-main-wrapper">{children}</main>
      </div>
    </>
  );
};

export default Layout;
