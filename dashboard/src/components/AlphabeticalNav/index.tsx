import React, { FC } from "react";
import { Link } from "gatsby";

type AlphabeticalNavProps = {
  sortedItems: Map<string, any[]>;
};

const generateListOfAlphabetLetters = (): string[] => {
  const charCodes = Array.from(Array(26)).map((e, i) => i + 65);
  return charCodes.map((charCode) => String.fromCharCode(charCode));
};

const listOfAlphabetLetters = generateListOfAlphabetLetters();

export const AlphabeticalNav: FC<AlphabeticalNavProps> = ({ sortedItems }) => {
  return (
    <nav
      className="nhsuk-u-margin-bottom-4 nhsuk-u-margin-top-4"
      id="nhsuk-nav-a-z"
      role="navigation"
      aria-label="A to Z Navigation"
    >
      <ol className="nhsuk-list nhsuk-u-clear nhsuk-u-margin-0" role="list">
        {listOfAlphabetLetters.map((letter) =>
          sortedItems.get(letter) ? (
            <li
              className="nhsuk-u-margin-bottom-0 nhsuk-u-float-left nhsuk-u-margin-right-1"
              key={letter}
            >
              <Link
                className="nhsuk-u-font-size-22 nhsuk-u-padding-2 nhsuk-u-display-block"
                onClick={(e) => e.currentTarget.blur()}
                to={`#${letter}`}
              >
                {letter}
              </Link>
            </li>
          ) : (
            <li
              className="nhsuk-u-margin-bottom-0 nhsuk-u-float-left nhsuk-u-margin-right-1 nhsuk-nav-a-z__no-link"
              key={letter}
            >
              <span className="nhsuk-u-font-size-22 nhsuk-u-padding-2 nhsuk-u-display-block">
                {letter}
              </span>
            </li>
          )
        )}
      </ol>
    </nav>
  );
};
