export const practiceWithOneMonthMetrics = {
  odsCode: "A12345",
  name: "GP Practice",
  ccgOdsCode: "11D",
  ccgName: "Some CCG",
  metrics: [
    {
      year: 2020,
      month: 2,
      requestedTransfers: {
        requestedCount: 7,
        receivedCount: 5,
        receivedPercentOfRequested: 71.42,
        integratedWithin3DaysCount: 3,
        integratedWithin3DaysPercentOfReceived: 60.0,
        integratedWithin8DaysCount: 2,
        integratedWithin8DaysPercentOfReceived: 40.0,
        notIntegratedWithin8DaysTotal: 0,
        notIntegratedWithin8DaysPercentOfReceived: 0,
        failuresTotalCount: 2,
        failuresTotalPercentOfRequested: 28.6,
      },
    },
  ],
};

export const practiceWithTwoMonths = {
  odsCode: "A12346",
  name: "Second GP Practice",
  ccgOdsCode: "10E",
  ccgName: "Another CCG",
  metrics: [
    {
      year: 2020,
      month: 2,
      requestedTransfers: {
        requestedCount: 22,
        receivedCount: 22,
        receivedPercentOfRequested: 100.0,
        integratedWithin3DaysCount: 5,
        integratedWithin3DaysPercentOfReceived: 22.7,
        integratedWithin8DaysCount: 6,
        integratedWithin8DaysPercentOfReceived: 27.3,
        notIntegratedWithin8DaysTotal: 11,
        notIntegratedWithin8DaysPercentOfReceived: 50,
        failuresTotalCount: 0,
        failuresTotalPercentOfRequested: 0,
      },
    },
    {
      year: 2020,
      month: 1,
      requestedTransfers: {
        requestedCount: 22,
        receivedCount: 22,
        receivedPercentOfRequested: 100.0,
        integratedWithin3DaysCount: 5,
        integratedWithin3DaysPercentOfReceived: 22.7,
        integratedWithin8DaysCount: 6,
        integratedWithin8DaysPercentOfReceived: 27.3,
        notIntegratedWithin8DaysTotal: 11,
        notIntegratedWithin8DaysPercentOfReceived: 50,
        failuresTotalCount: 0,
        failuresTotalPercentOfRequested: 0,
      },
    },
  ],
};

export const practiceWithThreeMonthsMetrics = {
  odsCode: "B86030",
  name: "BURTON CROFT SURGERY",
  ccgOdsCode: "11D",
  ccgName: "Test ccg",
  metrics: [
    {
      year: 2019,
      month: 11,
      requestedTransfers: {
        requestedCount: 22,
        receivedCount: 22,
        receivedPercentOfRequested: 100,
        integratedWithin3DaysCount: 5,
        integratedWithin3DaysPercentOfReceived: 22.7,
        integratedWithin8DaysCount: 12,
        integratedWithin8DaysPercentOfReceived: 54.6,
        notIntegratedWithin8DaysTotal: 3,
        notIntegratedWithin8DaysPercentOfReceived: 13.6,
        failuresTotalCount: 0,
        failuresTotalPercentOfRequested: 0.0,
      },
    },
    {
      year: 2019,
      month: 10,
      requestedTransfers: {
        requestedCount: 15,
        receivedCount: 15,
        receivedPercentOfRequested: 100,
        integratedWithin3DaysCount: 10,
        integratedWithin3DaysPercentOfReceived: 66.7,
        integratedWithin8DaysCount: 2,
        integratedWithin8DaysPercentOfReceived: 13.3,
        notIntegratedWithin8DaysTotal: 3,
        notIntegratedWithin8DaysPercentOfReceived: 0.2,
        failuresTotalCount: 0,
        failuresTotalPercentOfRequested: 0.0,
      },
    },
    {
      year: 2019,
      month: 9,
      requestedTransfers: {
        requestedCount: 30,
        receivedCount: 16,
        receivedPercentOfRequested: 15.3,
        integratedWithin3DaysCount: 10,
        integratedWithin3DaysPercentOfReceived: 62.5,
        integratedWithin8DaysCount: 2,
        integratedWithin8DaysPercentOfReceived: 12.5,
        notIntegratedWithin8DaysTotal: 4,
        notIntegratedWithin8DaysPercentOfReceived: 25.0,
        failuresTotalCount: 0,
        failuresTotalPercentOfRequested: 0.0,
      },
    },
  ],
};

export const practiceWithCommasInTheName = {
  odsCode: "A12345",
  name: "Dr GP1, Dr GP2, Practice",
  ccgOdsCode: "11D",
  ccgName: "Test, and test ccg",
  metrics: [
    {
      year: 2020,
      month: 2,
      requestedTransfers: {
        requestedCount: 7,
        receivedCount: 5,
        receivedPercentOfRequested: 71.42,
        integratedWithin3DaysCount: 3,
        integratedWithin3DaysPercentOfReceived: 60.0,
        integratedWithin8DaysCount: 2,
        integratedWithin8DaysPercentOfReceived: 40.0,
        notIntegratedWithin8DaysTotal: 0,
        notIntegratedWithin8DaysPercentOfReceived: 0,
        failuresTotalCount: 2,
        failuresTotalPercentOfRequested: 28.6,
      },
    },
  ],
};
