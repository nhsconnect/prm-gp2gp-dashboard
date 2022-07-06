import capitalize from "lodash/capitalize";

export const convertToTitleCase = (string: string): string => {
  if (string.includes("ICB")) {
    const icbName = string.split("-");

    if (icbName.length == 1) {
      return string;
    }

    const icbOdsCode = icbName.pop();
    const icbNameWithoutOds = icbName
      .toString()
      .split(" ")
      .map((word) => (["NHS", "ICB"].includes(word) ? word : capitalize(word)))
      .join(" ");
    return `${icbNameWithoutOds} - ${icbOdsCode}`;
  }

  return string
    .split(" ")
    .map((word) => (["NHS", "GP"].includes(word) ? word : capitalize(word)))
    .join(" ");
};
