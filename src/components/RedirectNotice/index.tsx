import React, { FC } from "react";
import "./index.scss";
import { Link } from "gatsby";

type RedirectNoticeProps = {
  redirectLink: string;
};

export const RedirectNotice: FC<RedirectNoticeProps> = ({ redirectLink }) => {
  return (
    <>
      <h1>This page has been moved.</h1>
      <p>
        To access, go to this <Link to={redirectLink}>link</Link>
      </p>
    </>
  );
};
