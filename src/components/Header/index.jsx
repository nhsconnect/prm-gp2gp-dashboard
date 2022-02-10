import React from "react";
import { Link } from "gatsby";
import Logo from "../../assets/logo.svg";
import { PhaseBanner } from "../common/PhaseBanner/";
import "./index.scss";
import content from "../../data/content/header.json";

export const Header = () => {
  return (
    <header className="nhsuk-header" role="banner">
      <div className="gp2gp-width-container nhsuk-header__container">
        <div className="nhsuk-header__logo nhsuk-header__logo--only">
          <Link
            className="gp2gp-header__link"
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
      <div className="gp2gp-width-container nhsuk-u-padding-bottom-3">
        <PhaseBanner tag={content.phaseBanner.tag}>
          {content.phaseBanner.text}
        </PhaseBanner>
      </div>
    </header>
  );
};
