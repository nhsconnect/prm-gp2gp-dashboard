import React, { FC } from "react";
import { Link } from "gatsby";

import "./index.scss";

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
      id="nhsuk-nav-a-z"
      className="nhsuk-nav-a-z"
      aria-label="A to Z Navigation"
    >
      <ol className="nhsuk-nav-a-z__list">
        {listOfAlphabetLetters.map((letter) =>
          sortedItems.get(letter) ? (
            <li className="nhsuk-nav-a-z__item" key={letter}>
              <Link
                to={`#${letter}`}
                className="nhsuk-nav-a-z__link"
                onClick={(e) => e.currentTarget.blur()}
              >
                {letter}
              </Link>{" "}
            </li>
          ) : (
            <li
              className="nhsuk-nav-a-z__item nhsuk-nav-a-z__no-link"
              key={letter}
            >
              {letter}
            </li>
          )
        )}
      </ol>
    </nav>
  );
};
