import React, { FC } from "react";
import { Helmet } from "react-helmet";

const ContactUs: FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact us - GP Registrations Data</title>
        <meta
          name="description"
          content="Contact us for GP Registrations Data"
        />
      </Helmet>
      <div className="nhsuk-u-reading-width">
        <h1>Contact us</h1>
        <p>
          If you are a patient and you need medical advice, you should call 111,
          or use the web service at <a href="https://111.nhs.uk/">111.nhs.uk</a>{" "}
          .
        </p>
        <p>
          If you are a patient, please contact your practice directly. NHS
          services -{" "}
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
        <p>
          If you are a practice and have a query about specific transfers for
          your practice, please contact your system supplier.
        </p>

        <p>
          If you need help with this site, or if it isn't working properly,
          contact the team at{" "}
          <a href="mailto:gp-registrations-data@nhs.net">
            gp-registrations-data@nhs.net
          </a>{" "}
          We are unable to assist with individual patient or practice queries.
          Please do not send any personal information to this email address.
        </p>
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
