import React, { FC } from "react";
import { Link } from "gatsby";

type RedirectNoticeProps = {
  redirectLink: string;
  linkText: string;
};

export const RedirectNotice: FC<RedirectNoticeProps> = ({
  redirectLink,
  linkText,
}) => {
  return (
    <div className="nhsuk-u-reading-width nhsuk-u-margin-top-5 nhsuk-u-margin-bottom-5">
      <h1 className="nhsuk-u-margin-bottom-5">This page has been moved.</h1>
      <p>
        Please go to <Link to={redirectLink}>{linkText}</Link> to view the page.
      </p>
    </div>
  );
};
