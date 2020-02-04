import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import Logo from "../../assets/logo.svg";
import PhaseBanner from "../PhaseBanner/index";

const Header = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allFile(filter: { name: { eq: "header" } }) {
          edges {
            node {
              childContentJson {
                serviceName
                phaseBanner {
                  tag
                  text
                }
              }
            }
          }
        }
      }
    `
  ).allFile.edges[0].node.childContentJson;
  const serviceName = data.serviceName;
  const phaseBanner = data.phaseBanner;

  return (
    <header className="nhsuk-header nhsuk-header--transactional" role="banner">
      <div className="nhsuk-width-container nhsuk-header__container">
        <div className="nhsuk-header__logo nhsuk-header__logo--only">
          <Link className="nhsuk-header__link" to="/" aria-label="NHS homepage">
            <Logo />
          </Link>
        </div>
        <div className="nhsuk-header__transactional-service-name nhsuk-header__transactional-service-name--long">
          <Link
            className="nhsuk-header__transactional-service-name--link"
            to="/"
          >
            {serviceName}
          </Link>
        </div>
      </div>
      <div className="nhsuk-width-container nhsuk-u-margin-bottom-3">
        <PhaseBanner tag={phaseBanner.tag}>{phaseBanner.text}</PhaseBanner>
      </div>
    </header>
  );
};

export default Header;
