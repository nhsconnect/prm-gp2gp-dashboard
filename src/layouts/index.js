import React from "react";
import Header from "../components/Header/index";
import "./index.scss";

const Layout = ({ children }) => (
  <React.Fragment>
    <Header />
    <div className="nhsuk-width-container">
      <main className="nhsuk-main-wrapper">{children}</main>
    </div>
  </React.Fragment>
);

export default Layout;
