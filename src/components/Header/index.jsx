import React from "react";
import { Link } from "gatsby";
import Logo from "../../assets/logo.svg";
import PhaseBanner from "../PhaseBanner/index";
import "./index.scss";
import content from "../../data/content/header.json";

const Header = () => {
  return (
    <header className="nhsuk-header" role="banner">
      <div className="nhsuk-width-container nhsuk-header__container">
        <div className="nhsuk-header__logo nhsuk-header__logo--only">
          <Link
            className="nhsuk-header__link nhsuk-header__link--service"
            to="/"
            aria-label={content.homepageLinkLabel}
          >
            <Logo />
            <span className="nhsuk-header__service-name">
              {content.serviceName}
            </span>
          </Link>
        </div>
      </div>
      <div className="nhsuk-width-container nhsuk-u-padding-bottom-3">
        <PhaseBanner tag={content.phaseBanner.tag}>
          {content.phaseBanner.text}
        </PhaseBanner>
      </div>
    </header>
  );
};

export default Header;
