import React, { FC } from "react";
import { Link } from "gatsby";
import "./index.scss";
import UpArrow from "../../assets/upArrow.svg";

import { convertToTitleCase } from "../../library/utils/convertToTitleCase";
import sicblDirectoryContent from "../../data/content/sicblDirectory.json";

type AlphabeticalSICBLProps = {
  sortedSICBLs: Map<string, { name: string; odsCode: string }[]>;
};

export const AlphabeticalSICBLList: FC<AlphabeticalSICBLProps> = ({
  sortedSICBLs,
}) => {
  return (
    <ol className="nhsuk-list">
      {[...sortedSICBLs.entries()].map(
        ([alphabetLetter, sicblsBeginningWithLetter]) => (
          <li key={alphabetLetter}>
            <div className="nhsuk-list-panel">
              <h2 className="nhsuk-list-panel__label" id={alphabetLetter}>
                {alphabetLetter}
              </h2>
              <ul className="nhsuk-list-panel__list nhsuk-list-panel__list--with-label">
                {sicblsBeginningWithLetter.map((sicbl) => (
                  <li className="nhsuk-list-panel__item" key={sicbl.odsCode}>
                    <Link
                      to={`/sub-ICB-location/${sicbl.odsCode}/integration-times`}
                      className="gp2gp-list-panel__link"
                    >
                      {convertToTitleCase(sicbl.name)}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="nhsuk-back-to-top">
                <Link to="#nhsuk-nav-a-z" className="nhsuk-back-to-top__link">
                  <UpArrow />
                  {sicblDirectoryContent.linkText}
                </Link>
              </div>
            </div>
          </li>
        )
      )}
    </ol>
  );
};
