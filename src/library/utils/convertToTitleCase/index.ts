import capitalize from "lodash/capitalize";

export const convertToTitleCase = (string: string): string => {
  const ICB_SUFFIX = "ICB -";
  if (string.includes(ICB_SUFFIX)) {
    const icbName = string.split(ICB_SUFFIX);
    const icbOdsCode = icbName.pop()?.toUpperCase();
    const icbNameWithoutOds = capitaliseNonNHSAcronyms(icbName.toString());

    return `${icbNameWithoutOds}${ICB_SUFFIX}${icbOdsCode}`;
  }

  return capitaliseNonNHSAcronyms(string);
};

const capitaliseNonNHSAcronyms = (string: string): string => {
  return string
    .split(" ")
    .map((word) =>
      ["NHS", "GP", "ICB"].includes(word) ? word : capitalize(word)
    )
    .join(" ");
};
