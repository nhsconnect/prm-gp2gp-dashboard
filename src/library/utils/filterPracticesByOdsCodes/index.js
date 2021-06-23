const filterPracticesByOdsCodes = (odsCodes, practices) => {
  return practices.filter((practice) => odsCodes.includes(practice.odsCode));
};

module.exports = filterPracticesByOdsCodes;
