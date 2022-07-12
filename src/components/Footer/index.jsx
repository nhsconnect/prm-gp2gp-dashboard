import React from "react";
import { Link } from "gatsby";
import "./index.scss";

export const Footer = () => {
  return (
    <footer role="contentinfo">
      <div className="nhsuk-footer">
        <div className="gp2gp-width-container">
          <h2 className="nhsuk-u-visually-hidden">Support links</h2>
          <ul className="nhsuk-footer__list">
            <li className="nhsuk-footer__list-item">
              <Link
                className="nhsuk-footer__list-item-link"
                to="/cookies-policy"
              >
                Cookies
              </Link>
            </li>
            <li className="nhsuk-footer__list-item">
              <Link className="nhsuk-footer__list-item-link" to="/your-privacy">
                Your privacy
              </Link>
            </li>
            <li className="nhsuk-footer__list-item">
              <Link
                className="nhsuk-footer__list-item-link"
                to="/accessibility-statement"
              >
                Accessibility statement
              </Link>
            </li>
            <li className="nhsuk-footer__list-item">
              <Link
                className="nhsuk-footer__list-item-link"
                to="/definitions-and-notes-about-this-data"
              >
                Definitions and notes about this data
              </Link>
            </li>
            <li className="nhsuk-footer__list-item">
              <Link
                className="nhsuk-footer__list-item-link"
                to="/sub-ICB-locations"
              >
                Sub ICB Location A to Z
              </Link>
            </li>
            <li className="nhsuk-footer__list-item">
              <Link className="nhsuk-footer__list-item-link" to="/contact-us">
                Contact us
              </Link>
            </li>
          </ul>
          <p className="nhsuk-footer__copyright">&copy; Crown copyright</p>
        </div>
      </div>
    </footer>
  );
};
