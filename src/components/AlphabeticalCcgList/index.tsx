import React, { FC } from "react";
import { Link } from "gatsby";
import "./index.scss";
import UpArrow from "../../assets/upArrow.svg";

import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import ccgDirectoryContent from "../../data/content/ccgDirectory.json";

type AlphabeticalCcgProps = {
  sortedCcgs: Map<string, { name: string; odsCode: string }[]>;
};

export const AlphabeticalCcgList: FC<AlphabeticalCcgProps> = ({
  sortedCcgs,
}) => {
  return (
    <ol className="nhsuk-list">
      {[...sortedCcgs.entries()].map(
        ([alphabetLetter, ccgsBeginningWithLetter]) => (
          <li key={alphabetLetter}>
            <div className="nhsuk-list-panel">
              <h2 className="nhsuk-list-panel__label" id={alphabetLetter}>
                {alphabetLetter}
              </h2>
              <ul className="nhsuk-list-panel__list nhsuk-list-panel__list--with-label">
                {ccgsBeginningWithLetter.map((ccg) => (
                  <li className="nhsuk-list-panel__item" key={ccg.odsCode}>
                    <Link
                      to={`/ccg/${ccg.odsCode}`}
                      className="gp2gp-list-panel__link"
                    >{`${convertToTitleCase(ccg.name)} - ${ccg.odsCode}`}</Link>
                  </li>
                ))}
              </ul>
              <div className="nhsuk-back-to-top">
                <Link to="#nhsuk-nav-a-z" className="nhsuk-back-to-top__link">
                  <UpArrow />
                  {ccgDirectoryContent.linkText}
                </Link>
              </div>
            </div>
          </li>
        )
      )}
    </ol>
  );
};
