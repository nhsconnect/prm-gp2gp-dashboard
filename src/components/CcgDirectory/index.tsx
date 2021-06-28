import React, { FC } from "react";
import { Link } from "gatsby";

import { CcgType } from "../../templates/Ccg/ccg.types";
import { sortOrganisationsAlphabetically } from "../../library/utils/sortOrganisationsAlphabetically";
import { convertToTitleCase } from "../../library/utils/convertToTitleCase";

type CcgDirectoryProps = {
  ccgs: CcgType[];
};

export const CcgDirectory: FC<CcgDirectoryProps> = ({ ccgs }) => {
  const sortedCCGs = sortOrganisationsAlphabetically(ccgs);
  return (
    <ol>
      {Object.entries(sortedCCGs).map(
        ([alphabetLetter, ccgsBeginningWithLetter]) => (
          <li key={alphabetLetter}>
            <h2>{alphabetLetter}</h2>
            <ul>
              {ccgsBeginningWithLetter.map((ccg) => (
                <li key={ccg.odsCode}>
                  <Link to={`/ccg/${ccg.odsCode}`}>{`${convertToTitleCase(
                    ccg.name
                  )} - ${ccg.odsCode}`}</Link>
                </li>
              ))}
            </ul>
          </li>
        )
      )}
    </ol>
  );
};
