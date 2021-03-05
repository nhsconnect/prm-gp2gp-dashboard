import React, { FC } from "react";
import { Helmet } from "react-helmet";
import Table from "../../components/Table";
import { useFeatureToggle } from "../../library/hooks/useFeatureToggle";
import { convertMonthNumberToText } from "../../library/utils/convertMonthNumberToText";

type PageContext = {
  year: number;
  month: number;
  transferCount: number;
  integrated: IntegratedStats;
  // TODO: Make it not optional as part of PRMT-1489 cleanup
  failed?: FailedStats;
  pending?: PendingStats;
  paperFallback: PaperStats;
};

type IntegratedStats = {
  transferCount: number;
  transferPercentage: number;
  within3Days: number;
  within8Days: number;
  beyond8Days: number;
};

type FailedStats = {
  transferCount: number;
  transferPercentage: number;
};

type PendingStats = {
  transferCount: number;
  transferPercentage: number;
};

type PaperStats = {
  transferCount: number;
  transferPercentage: number;
};

type NationalStatisticsProps = {
  pageContext: PageContext;
};

const NationalStatistics: FC<NationalStatisticsProps> = ({ pageContext }) => {
  const {
    month,
    year,
    transferCount,
    integrated,
    paperFallback,
    failed,
    pending,
  } = pageContext;
  const monthName = convertMonthNumberToText(month);
  const isFailedAndPendingTransfersOn = useFeatureToggle(
    "F_FAILED_AND_PENDING_TRANSFERS"
  );

  return (
    <>
      <Helmet title="National Statistics" />
      <h1>National data on GP2GP performance</h1>
      <p>The data below shows the GP2GP performance nationally</p>
      <p>
        The data is updated monthly, 14 days after the end of the month, so that
        we can identify whether transfers initiated on the last day of the month
        were integrated within the 8 day SLA. There may be some transfers that
        have been initiated in this time period and will be integrated in the
        future, which will not be represented in this data.
      </p>
      <h2 className="nhsuk-heading-m">
        GP2GP Performance for {monthName} {year}
      </h2>
      <h3 className="nhsuk-heading-s">Total number of transfers initiated</h3>
      <p>
        This includes all GP2GP transfers that were started, regardless of
        whether the request was successful or failed.
      </p>
      <ul>
        <li>Count: {transferCount}</li>
      </ul>
      <h3 className="nhsuk-heading-s">Successfully integrated records</h3>
      <p>
        Any transfer that was successfully completed from a technical
        perspective, whether it’s in the 8 day SLA or not.
      </p>
      <ul>
        <li>Count: {integrated.transferCount}</li>
        <li>Percent: {integrated.transferPercentage}%</li>
      </ul>
      <h3 className="nhsuk-heading-s">SLA Bandings/Metrics</h3>
      <p>
        Records integrated, regardless of how long it took and whether they
        triggered the paper process.
      </p>
      <Table
        headers={["within 3 days", "within 8 days", "beyond 8 days"]}
        rows={[
          [
            integrated.within3Days.toString(),
            integrated.within8Days.toString(),
            integrated.beyond8Days.toString(),
          ],
        ]}
      />
      <h3 className="nhsuk-heading-s">Total paper fall back rate</h3>
      <p>
        Records not integrated within 8 days trigger the paper fallback process.
      </p>
      <ul>
        <li>Count: {paperFallback.transferCount}</li>
        <li>Percent: {paperFallback.transferPercentage}%</li>
      </ul>
      {isFailedAndPendingTransfersOn && (
        <>
          <h3 className="nhsuk-heading-s">Failed transfers</h3>
          <p>
            Technical errors such as large attachment failures that trigger the
            paper fallback process.
          </p>
          <ul>
            <li>
              Count:{" "}
              {
                // TODO: Remove as part of PRMT-1489 cleanup
                // @ts-ignore
                failed.transferCount
              }
            </li>
            <li>
              Percent:{" "}
              {
                // @ts-ignore
                failed.transferPercentage
              }
              %
            </li>
          </ul>
          <h3 className="nhsuk-heading-s">Pending transfers</h3>
          <p>
            Any transfers that trigger the paper fallback due to never being
            actioned by a human or unreported technical errors.
          </p>
          <ul>
            <li>
              Count:{" "}
              {
                // TODO: Remove as part of PRMT-1489 cleanup
                // @ts-ignore
                pending.transferCount
              }
            </li>
            <li>
              Percent:{" "}
              {
                // @ts-ignore
                pending.transferPercentage
              }
              %
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default NationalStatistics;
