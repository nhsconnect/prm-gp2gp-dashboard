import React, { FC, MouseEvent, useEffect } from "react";
import "./index.scss";

export const SkipLink: FC = () => {
  useEffect(() => {
    return () => {
      //remove heading blur event listener on unmount for skip link
      const heading = document.getElementsByTagName("h1")[0];
      if (heading) {
        heading.removeEventListener("blur", () =>
          heading.removeAttribute("tabIndex")
        );
      }
    };
  });

  const handleSkipLink = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.currentTarget.blur();

    const heading = document.getElementsByTagName("h1")[0];

    if (heading) {
      heading.setAttribute("tabIndex", "-1");
      heading.focus();
      heading.addEventListener("blur", () => {
        heading.removeAttribute("tabIndex");
      });
    }
  };

  return (
    // needs maincontent as an id on <main> for when Javascript is disabled or screen reader used
    <a className="nhsuk-skip-link" href="#maincontent" onClick={handleSkipLink}>
      Skip to main content
    </a>
  );
};
