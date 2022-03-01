import { getIntegrationTimesCsv } from "../index";

describe("getIntegrationTimesCsv", () => {
  it("returns one word in title case", async () => {
    const firstPractice = {
      odsCode: "A12345",
      name: "GP Practice",
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
            notIntegratedWithin8DaysPercentOfReceived: null,
            failuresTotalCount: 2,
            failuresTotalPercentOfRequested: 28.6,
            integratedCount: 5,
            integratedBeyond8DaysCount: 0,
            awaitingIntegrationCount: 0,
            technicalFailuresCount: 2,
            unclassifiedFailureCount: 0,
          },
        },
      ],
    };

    const secondPractice = {
      odsCode: "A12346",
      name: "Second GP Practice",
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
            failuresTotalPercentOfRequested: null,
            integratedCount: 21,
            integratedBeyond8DaysCount: 10,
            awaitingIntegrationCount: 1,
            technicalFailuresCount: 0,
            unclassifiedFailureCount: 0,
          },
        },
      ],
    };
    const ccgPractices = [firstPractice, secondPractice];
    const ccgName = "Some CCG";
    const ccgOdsCode = "CCG_ABC_123";
    const actual = getIntegrationTimesCsv(ccgPractices, ccgName, ccgOdsCode);
    const expected = [
      "Some CCG,CCG_ABC_123,GP Practice,A12345,February 2020,5,3,60%,2,40%,0,n/a",
      "Some CCG,CCG_ABC_123,Second GP Practice,A12346,February 2020,22,5,22.7%,6,27.3%,11,50%",
    ];

    expect(actual).toEqual(expected);
  });
});
