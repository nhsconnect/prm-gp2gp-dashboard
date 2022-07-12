import capitalize from "lodash/capitalize";

export const convertToTitleCase = (string: string): string => {
  const SICBL_SUFFIX = "ICB -";
  if (string.includes(SICBL_SUFFIX)) {
    const sicblName = string.split(SICBL_SUFFIX);
    const sicblOdsCode = sicblName.pop()?.toUpperCase();
    const sicblNameWithoutOds = capitaliseNonNHSAcronyms(sicblName.toString());

    return `${sicblNameWithoutOds}${SICBL_SUFFIX}${sicblOdsCode}`;
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
