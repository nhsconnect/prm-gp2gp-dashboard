import { Link } from "gatsby";
import React, { FC } from "react";
import { Helmet } from "react-helmet";
import content from "../data/content/emailAnchor.json";

const YourPrivacy: FC = () => {
  return (
    <>
      <Helmet>
        <title>Your Privacy - GP Registrations Data</title>
        <meta
          name="description"
          content="Privacy Policy for GP Registrations Data"
        />
      </Helmet>
      <div className="nhsuk-u-reading-width">
        <h1>Your privacy</h1>
        <p className="nhsuk-lede-text">
          Your privacy is important to us. This privacy policy covers what we
          collect and how we use, share and store your information.
        </p>
        <p>This page tells you:</p>
        <ul>
          <li>about the information we may collect</li>
          <li>how we keep your data secure</li>
          <li>who we share your data with</li>
          <li>
            about your rights to see or change information we hold about you
          </li>
        </ul>
        <h2>Information we may collect</h2>
        <h3>Cookies</h3>
        <p>
          Our website uses cookies. These are small files saved on your phone,
          tablet or computer when you visit a website. They store information
          about how you use the website, such as the pages you visit.
        </p>
        <p>
          The law says that we can store cookies on your device if they are
          strictly necessary to make our website work. For all other types of
          cookies we need your permission before we can use them on your device.
        </p>
        <p>
          We like to use analytics cookies which measure how you use our website
          and help us improve our service for future users but we only use these
          cookies if you say it's OK.
        </p>
        <p>
          <Link to="/cookies-policy">Read our cookie policy</Link> to find out
          more about the cookies we use and tell us if we can put analytics
          cookies on your device.
        </p>
        <p>
          We sometimes use tools on other organisations' websites to collect
          data. These tools set their own cookies.
        </p>
        <h2>Data sharing</h2>
        <p>
          NHS Digital may share anonymous information on how the service is used
          with the Department of Health and Social Care, NHS England, Integrated
          Care Boards (SICBLs), and the National Clinical Governance Group.
        </p>
        <h3>Legal powers</h3>
        <p>
          When you give us personal information, we may pass it on if the law
          says we must.
        </p>
        <p>
          If you make a claim against us, we and other third parties such as our
          solicitors may need to look at this information.
        </p>
        <p>
          We will not share your personal information with anyone else without
          your permission for any other reason.
        </p>
        <h2>Your rights</h2>
        <p>You can:</p>
        <ul>
          <li>
            find out what information we hold about you, ask us to correct it if
            it's wrong, or delete it by emailing{" "}
            <a
              href={`mailto:gp-registrations-data@nhs.net?body=${encodeURIComponent(
                content.emailBody
              )}`}
            >
              gp-registrations-data@nhs.net
            </a>
          </li>
          <li>
            contact the{" "}
            <a href="https://ico.org.uk/">Information Commissioner's Office</a>,
            Wycliffe House Water Lane, Wilmslow SK9 5AF if you want to make a
            complaint about how we have managed your data
          </li>
        </ul>
        <p>
          NHS Digital, 1 Trevelyan Square, Boar Lane, Leeds, LS1 6AE is the Data
          Controller for the NHS digital service manual under data protection
          legislation. We will process your data in line with data protection
          legislation.
        </p>
      </div>
    </>
  );
};

export default YourPrivacy;
