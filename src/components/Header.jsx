import React from "react";
import { Link } from "gatsby";
import Logo from "../assets/logo.svg";

const Header = () => (
  <header className="nhsuk-header nhsuk-header--transactional" role="banner">
    <div className="nhsuk-width-container nhsuk-header__container">
      <div className="nhsuk-header__logo nhsuk-header__logo--only">
        <Link className="nhsuk-header__link" to="/" aria-label="NHS homepage">
          <Logo />
        </Link>
      </div>
      <div className="nhsuk-header__transactional-service-name nhsuk-header__transactional-service-name--long">
        <Link className="nhsuk-header__transactional-service-name--link" to="/">
          GP2GP Service Dashboard
        </Link>
      </div>
    </div>
  </header>
);

export default Header;
