import { PracticeType } from "../../../templates/Practice/practice.types";

export const filterPracticesByOdsCodes = (
  odsCodes: string[],
  practices: PracticeType[]
) => {
  return practices.filter((practice) => odsCodes.includes(practice.odsCode));
};
