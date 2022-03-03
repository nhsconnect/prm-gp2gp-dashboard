const baseHeadings = {
  CCG_NAME: "CCG name",
  CCG_ODS: "CCG ODS",
  REQUESTING_PRACTICE_NAME: "Requesting practice name",
  PRACTICE_ODS: "Practice ODS",
  MONTH_AND_YEAR: "Month",
};

const integrationTimesSpecific = {
  TRANSFERS_RECEIVED_COUNT: "GP2GP Transfers received",
  INTEGRATED_WITHIN_3_DAYS_COUNT: "Integrated within 3 days",
  INTEGRATED_WITHIN_3_DAYS_PERCENT: "Integrated within 3 days - %",
  INTEGRATED_WITHIN_8_DAYS_COUNT: "Integrated within 8 days ",
  INTEGRATED_WITHIN_8_DAYS_PERCENT: "Integrated within 8 days - %",
  NOT_INTEGRATED_WITHIN_8_DAYS_COUNT:
    "Not integrated within 8 days (paper copy requested)",
  NOT_INTEGRATED_WITHIN_8_DAYS_PERCENT:
    "Not integrated within 8 days (paper copy requested) - %",
};

const transfersRequestedSpecific = {
  GP2GP_TRANSFERS_REQUESTED: "GP2GP transfers requested",
  GP2GP_TRANSFERS_RECEIVED: "GP2GP transfers received",
  GP2GP_TRANSFERS_RECEIVED_PERCENT: "GP2GP transfers received - %",
  GP2GP_TECHNICAL_FAILURES: "GP2GP technical failures (paper copy requested)",
  GP2GP_TECHNICAL_FAILURES_PERCENT:
    "GP2GP technical failures (paper copy requested) - %",
};

export const IntegrationRowHeadings = {
  ...baseHeadings,
  ...integrationTimesSpecific,
};

export const TransfersRequestedRowHeadings = {
  ...baseHeadings,
  ...transfersRequestedSpecific,
};

export const AllCSVHeadings = {
  ...baseHeadings,
  ...transfersRequestedSpecific,
  ...integrationTimesSpecific,
};
