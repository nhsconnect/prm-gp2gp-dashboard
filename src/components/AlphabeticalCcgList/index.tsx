import React, { FC } from "react";
import { Link } from "gatsby";

import { convertToTitleCase } from "../../library/utils/convertToTitleCase";

type AlphabeticalCcgProps = {
  sortedCcgs: { [key: string]: { name: string; odsCode: string }[] };
};

export const AlphabeticalCcgList: FC<AlphabeticalCcgProps> = ({
  sortedCcgs,
}) => {
  return (
    <ol>
      {Object.entries(sortedCcgs).map(
        ([alphabetLetter, ccgsBeginningWithLetter]) => (
          <li key={alphabetLetter}>
            <h2 id={alphabetLetter}>{alphabetLetter}</h2>
            <ul>
              {ccgsBeginningWithLetter.map((ccg) => (
                <li key={ccg.odsCode}>
                  <Link to={`/ccg/${ccg.odsCode}`}>{`${convertToTitleCase(
                    ccg.name
                  )} - ${ccg.odsCode}`}</Link>
                </li>
              ))}
            </ul>
            <Link to="#nhsuk-nav-a-z">Back to top</Link>
          </li>
        )
      )}
    </ol>
  );
};
