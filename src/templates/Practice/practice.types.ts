export type IntegratedPracticeMetricsType = {
  transferCount: number;
  within3DaysPercentage: number | null;
  within8DaysPercentage: number | null;
  beyond8DaysPercentage: number | null;
};

export type PracticeMetricsType = {
  year: number;
  month: number;
  requester: {
    integrated: IntegratedPracticeMetricsType;
    transfersReceived: {
      transferCount: number;
      awaitingIntegration: {
        percentage: number | null;
      };
      integrated: IntegratedPracticeMetricsType;
    };
  };
};

export type PracticeType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsType[];
};
