import React, { FC } from "react";
import { Link } from "gatsby";
import "./index.scss";
import UpArrow from "../../assets/upArrow.svg";

import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import icbDirectoryContent from "../../data/content/icbDirectory.json";

type AlphabeticalICBProps = {
  sortedICBs: Map<string, { name: string; odsCode: string }[]>;
};

export const AlphabeticalICBList: FC<AlphabeticalICBProps> = ({
  sortedICBs,
}) => {
  return (
    <ol className="nhsuk-list">
      {[...sortedICBs.entries()].map(
        ([alphabetLetter, icbsBeginningWithLetter]) => (
          <li key={alphabetLetter}>
            <div className="nhsuk-list-panel">
              <h2 className="nhsuk-list-panel__label" id={alphabetLetter}>
                {alphabetLetter}
              </h2>
              <ul className="nhsuk-list-panel__list nhsuk-list-panel__list--with-label">
                {icbsBeginningWithLetter.map((icb) => (
                  <li className="nhsuk-list-panel__item" key={icb.odsCode}>
                    <Link
                      to={`/icb/${icb.odsCode}/integration-times`}
                      className="gp2gp-list-panel__link"
                    >{`${convertToTitleCase(icb.name)} - ${icb.odsCode}`}</Link>
                  </li>
                ))}
              </ul>
              <div className="nhsuk-back-to-top">
                <Link to="#nhsuk-nav-a-z" className="nhsuk-back-to-top__link">
                  <UpArrow />
                  {icbDirectoryContent.linkText}
                </Link>
              </div>
            </div>
          </li>
        )
      )}
    </ol>
  );
};
