import React from "react";
import { Link } from "gatsby";
import "./index.scss";

const Footer = () => (
  <footer role="contentinfo">
    <div className="nhsuk-footer">
      <div className="nhsuk-width-container">
        <h2 className="nhsuk-u-visually-hidden">Support links</h2>
        <ul className="nhsuk-footer__list">
          <li className="nhsuk-footer__list-item">
            <Link className="nhsuk-footer__list-item-link" to="/cookies-policy">
              Cookies
            </Link>
          </li>
          <li className="nhsuk-footer__list-item">
            <Link className="nhsuk-footer__list-item-link" to="/your-privacy">
              Your privacy
            </Link>
          </li>
        </ul>
        <p className="nhsuk-footer__copyright">&copy; Crown copyright</p>
      </div>
    </div>
  </footer>
);

export default Footer;
