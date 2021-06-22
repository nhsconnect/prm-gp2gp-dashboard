import React, { FC } from "react";
import { Helmet } from "react-helmet";

const AccessibilityStatement: FC = () => (
  <>
    <Helmet>
      <title>Accessibility statement - GP Registrations Data</title>
      <meta
        name="description"
        content="Accessibility Statement for GP Registrations Data"
      />
    </Helmet>
    <div className="nhsuk-u-reading-width">
      <h1>Accessibility statement</h1>
      <h2>How you can use this website</h2>
      <p>
        This accessibility statement is for the GP Registrations data website (
        <a href="https://gp-registrations-data.nhs.uk">
          gp-registrations-data.nhs.uk
        </a>
        ) only. It does not cover any other subsites or any websites linked from
        this one. Those sites will have their own accessibility statements.
      </p>
      <p>On this website, you should be able to:</p>
      <ul>
        <li>change colours, contrast levels, and fonts</li>
        <li>
          zoom in up to 300% with text staying visible on the screen, and most
          images scaling without resolution loss
        </li>
        <li>navigate the website using a keyboard</li>
        <li>navigate most of the website using speech recognition software</li>
        <li>
          read most of the website using a screen reader, including the latest
          versions of VoiceOver
        </li>
        <li>
          read most of the website on devices without a screen, like a braille
          computer
        </li>
      </ul>
      <h2>How accessible this website is</h2>
      <p>
        The majority of this website is fully accessible, however we have not
        tested the website across all screen readers.
      </p>
      <p>We have tested:</p>
      <ul>
        <li>VoiceOver (desktop screen reader)</li>
        <li>ChromeVox (Chrome screen reader plugin)</li>
      </ul>
      <p>We have not tested:</p>
      <ul>
        <li>JAWS (desktop screen reader)</li>
        <li>NVDA (desktop screen reader)</li>
        <li>TalkBack (mobile screen reader)</li>
        <li>Windows Magnifier or Apple Zoom (screen magnifiers)</li>
        <li>Dragon (speech recognition)</li>
      </ul>
      <p>
        The ability to search for a practice or a CCG does not work without
        JavaScript. Sorting functionality on the CCG page will not work without
        JavaScript.
      </p>
      <p>
        When you click on a link and are navigated to a new page, the focus may
        remain on that link.
      </p>
      <h2>Reporting accessibility problems</h2>
      <p>We're always looking to improve the accessibility of the website.</p>
      <p>
        If you find any problems which aren't listed on this page, or think that
        we're not meeting the requirements of the accessibility regulations then
        please email <a href="mailto:gp2gp@nhs.net">gp2gp@nhs.net</a> to let us
        know.
      </p>
      <h2>Enforcement procedure</h2>
      <p>
        The Equality and Human Rights Commission (EHRC) is responsible for
        enforcing the accessibility regulations. If you’re not happy with how we
        respond to your complaint,{" "}
        <a href="https://www.equalityadvisoryservice.com/">
          contact the Equality Advisory and Support Service (EASS)
        </a>
        .
      </p>
      <h2>Technical information about this website's accessibility</h2>
      <p>
        The Health and Social Care Information Centre is committed to making its
        website accessible, in accordance with the{" "}
        <a href="https://www.legislation.gov.uk/uksi/2018/852/contents/made">
          Public Sector Bodies (Websites and Mobile Applications) (No. 2)
          Accessibility Regulations 2018
        </a>
        .
      </p>
      <p>
        This website is partially compliant with the{" "}
        <a href="https://www.w3.org/TR/WCAG21/">
          Web Content Accessibility Guidelines version 2.1
        </a>{" "}
        AA standard, due to the non-compliances listed below.
      </p>
      <h3>Non-accessible content</h3>
      <p>
        We are mostly compliant with the WCAG 2.1 AA standard, however have one
        known issue. When you click on a link and are navigated to a new page,
        the focus may remain on that link.
      </p>
      <h3>Non-compliance with the accessibility regulations</h3>
      <p>
        We are currently not compliant with Success Criteria 2.4.3 - “focus
        order” of the WCAG 2.1 AA success criteria. We are aiming to have this
        issue fixed by September 2021.
      </p>
      <h2>Preparation of this accessibility statement</h2>
      <p>
        This statement was prepared on 23rd March 2021. It was last reviewed on
        17th June 2021. This website was last tested in May 2021. The test was
        carried out by the internal team. We tested all pages on the site using
        the NHS accessibility audit checklist.
      </p>
    </div>
  </>
);

export default AccessibilityStatement;
