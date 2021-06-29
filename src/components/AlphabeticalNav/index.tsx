import React, { FC } from "react";
import { Link } from "gatsby";

type AlphabeticalNavProps = {
  sortedItems: { [key: string]: any[] };
};

const generateListOfAlphabetLetters = (): string[] => {
  const charCodes = Array.from(Array(26)).map((e, i) => i + 65);
  return charCodes.map((charCode) => String.fromCharCode(charCode));
};

const listOfAlphabetLetters = generateListOfAlphabetLetters();

export const AlphabeticalNav: FC<AlphabeticalNavProps> = ({ sortedItems }) => {
  return (
    <nav id="nhsuk-nav-a-z">
      <ol>
        {listOfAlphabetLetters.map((letter) => (
          <li key={letter}>
            {sortedItems[letter] ? (
              <Link to={`#${letter}`}>{letter}</Link>
            ) : (
              letter
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
