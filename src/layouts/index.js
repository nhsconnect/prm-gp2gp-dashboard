import React from "react";
import Header from "../components/Header";
import "./index.scss";

const Layout = ({ children }) => (
  <React.Fragment>
    <Header />
    <div class="nhsuk-width-container">
      <main class="nhsuk-main-wrapper">
        {children}
      </main>
    </div>
  </React.Fragment>
);

export default Layout;
