import React, { FC } from "react";
import { Helmet } from "react-helmet";
import "./contact-us.scss";
import content from "../data/content/emailAnchor.json";

const ContactUs: FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact us - GP Registrations Data</title>
        <meta
          name="description"
          content="If you are a patient and you need medical advice, you should call 111. The GP Registrations Data team can help with enquiries about the data displayed on this site, not with individual patient or practice queries."
        />
      </Helmet>
      <div className="nhsuk-u-reading-width">
        <h1>Contact us</h1>
        <div className="gp2gp-emphasis-box">
          <h2 className="nhsuk-heading-s nhsuk-u-margin-bottom-2">
            If you need medical advice, call 111
          </h2>
          <p>
            If you are a patient and you need medical advice, you should call
            111, or use the web service at{" "}
            <a href="https://111.nhs.uk/">111.nhs.uk</a>.
          </p>
        </div>
        <h2 className="nhsuk-heading-s nhsuk-u-margin-bottom-2">
          If you are a patient, please contact your practice directly
        </h2>
        <p>
          NHS services -{" "}
          <a href="https://www.nhs.uk/service-search">
            Find details of your local doctor, dentist, or other NHS service at
            NHS.UK
          </a>{" "}
          (you do not need to know your{" "}
          <a href="https://www.nhs.uk/nhs-services/online-services/find-nhs-number/">
            NHS number
          </a>{" "}
          to use NHS services, but it can be useful to have it). We are unable
          to assist with individual patient or practice queries.
        </p>
        <h2 className="nhsuk-heading-s nhsuk-u-margin-bottom-2">
          If you are a practice
        </h2>
        <p>
          If you are a practice and have a query about specific transfers for
          your practice, please contact your system supplier. More information
          on how to contact your supplier is available on the{" "}
          <a href="https://digital.nhs.uk/services/gp2gp">
            NHS Digital GP2GP page
          </a>
          .
        </p>

        <h2 className="nhsuk-heading-s nhsuk-u-margin-bottom-2">
          If you need help with this site
        </h2>
        <p>
          If you need help with this site, or if it isn't working properly,
          contact the team at{" "}
          <a
            href={`mailto:gp-registrations-data@nhs.net?body=${encodeURIComponent(
              content.emailBody
            )}`}
          >
            gp-registrations-data@nhs.net
          </a>
          . We are unable to assist with individual patient or practice queries.
          Please do not send any personal information to this email address.
        </p>
        <h2 className="nhsuk-heading-s nhsuk-u-margin-bottom-2">
          Other queries
        </h2>
        <p>
          If you have a different type of query please see the{" "}
          <a href="https://digital.nhs.uk/about-nhs-digital/contact-us">
            NHS Digital contact us page
          </a>
          .
        </p>
      </div>
    </>
  );
};

export default ContactUs;
