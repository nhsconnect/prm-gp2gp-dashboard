import capitalize from "lodash/capitalize";

export const convertToTitleCase = (string: string): string => {
  const acronyms = ["NHS", "CCG", "GP"];

  return string
    .split(" ")
    .map((word) => (acronyms.includes(word) ? word : capitalize(word)))
    .join(" ");
};
