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
                homepageLinkLabel
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
  const { homepageLinkLabel, serviceName, phaseBanner } = data;

  return (
    <header className="nhsuk-header" role="banner">
      <div className="nhsuk-width-container nhsuk-header__container">
        <div className="nhsuk-header__logo nhsuk-header__logo--only">
          <Link
            className="nhsuk-header__link nhsuk-header__link--service"
            to="/"
            aria-label={homepageLinkLabel}
          >
            <Logo />
            <span className="nhsuk-header__service-name">{serviceName}</span>
          </Link>
        </div>
      </div>
      <div className="nhsuk-width-container nhsuk-u-padding-bottom-3">
        <PhaseBanner tag={phaseBanner.tag}>{phaseBanner.text}</PhaseBanner>
      </div>
    </header>
  );
};

export default Header;
