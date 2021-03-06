export type IntegratedPracticeMetricsType = {
  transferCount: number;
  within3DaysPercentage: number | null;
  within8DaysPercentage: number | null;
  beyond8DaysPercentage: number | null;
};

type PracticeMetricsType = {
  year: number;
  month: number;
  requester: {
    integrated: IntegratedPracticeMetricsType;
  };
};

export type PracticeType = {
  odsCode: string;
  name: string;
  metrics: PracticeMetricsType[];
};
