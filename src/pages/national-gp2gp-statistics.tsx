import React from "react";
import { Helmet } from "react-helmet";
import { Table } from "../components/common/Table";
import { convertMonthNumberToText } from "../library/utils/convertMonthNumberToText";
// @ts-ignore
import nationalMetrics from "../data/organisations/nationalMetrics.json";

type NationalStatisticsMetric = {
  year: number;
  month: number;
  transferCount: number;
  integrated: IntegratedStats;
  failed: FailedStats;
  pending: PendingStats;
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

const NationalStatistics = () => {
  const {
    month,
    year,
    transferCount,
    integrated,
    paperFallback,
    failed,
    pending,
  }: NationalStatisticsMetric = nationalMetrics.metrics[0];
  const monthName = convertMonthNumberToText(month);

  return (
    <>
      <Helmet>
        <title>National Statistics - GP Registrations Data Platform</title>
        <meta
          name="description"
          content="National monthly data about GP2GP transfers"
        />
      </Helmet>
      <h1>National GP2GP patient record transfers data</h1>
      <p>
        This page provides monthly national data about GP2GP transfers for
        practices in England.
      </p>
      <p>
        The Data Platform is updated 14 days after the end of the month. This is
        so we can identify whether transfers started at the end of the month
        were integrated within the 8 day SLA.
      </p>
      <p>
        Values presented as percentages are rounded to the nearest two decimal
        places.
      </p>
      <h2>
        GP2GP National Performance for {monthName} {year}
      </h2>
      <p>
        Figures are based on transfers started between the 1st and the last day
        of the month, inclusive.
      </p>
      <h3>Transfers started</h3>
      <p>
        Transfers that were started, regardless of whether the request was
        successful or failed.
      </p>
      <ul>
        <li data-testid="national-statistics__initiated-count">{`Count: ${transferCount}`}</li>
      </ul>
      <h3>Successful integrations</h3>
      <p>
        Transfers that were integrated (filed or suppressed) by the receiving
        practice before the Data Platform was updated.
      </p>
      <ul>
        <li data-testid="national-statistics__integrated-count">{`Count: ${integrated.transferCount}`}</li>
        <li data-testid="national-statistics__integrated-percent">{`Percent: ${integrated.transferPercentage}%`}</li>
      </ul>
      <h3>Integration times</h3>
      <h4>Within 3 days</h4>
      <p>
        The number of successful integrations that were integrated (filed or
        suppressed) within 3 days of the practice receiving the record.
      </p>
      <h4>Within 8 days</h4>
      <p>
        The number of successful integrations that were integrated (filed or
        suppressed) within 8 days of the practice receiving the record.
      </p>
      <h4>Beyond 8 days</h4>
      <p>
        The number of successful integrations that were integrated (filed or
        suppressed) beyond 8 days of the practice receiving the record. These
        transfers result in the paper fallback process being triggered.
      </p>
      <Table
        className="nhsuk-u-margin-bottom-5"
        headers={["Within 3 days", "Within 8 days", "Beyond 8 days"]}
        rows={[
          [
            integrated.within3Days.toString(),
            integrated.within8Days.toString(),
            integrated.beyond8Days.toString(),
          ],
        ]}
      />
      <h3>Technical failures</h3>
      <p>
        Records that fail to transfer due to technical error. These transfers
        result in the paper fallback process being triggered.
      </p>
      <ul>
        <li data-testid="national-statistics__failed-count">
          {`Count: ${failed.transferCount}`}
        </li>
        <li data-testid="national-statistics__failed-percent">
          {`Percent: ${failed.transferPercentage}%`}
        </li>
      </ul>
      <h3>Pending transfers</h3>
      <p>Transfers that either:</p>
      <ul>
        <li>
          have not been integrated by the time the Data Platform is updated, or
        </li>
        <li>have an unreported technical error</li>
      </ul>
      <p>
        These transfers result in the paper fallback process being triggered.
        Because the Data Platform is updated 14 days after the end of the month,
        all transfers that have not been integrated will be beyond the 8 day SLA
        and will have triggered the paper fallback process.
      </p>
      <ul>
        <li data-testid="national-statistics__pending-count">
          {`Count: ${pending.transferCount}`}
        </li>
        <li data-testid="national-statistics__pending-percent">
          {`Percent: ${pending.transferPercentage}%`}
        </li>
      </ul>
      <h3>Paper fallback transfers</h3>
      <p>
        Transfers that triggered the paper fallback process. The paper fallback
        process is triggered when a record is not received electronically, or is
        received but not integrated within 8 days.
      </p>
      <p>This includes:</p>
      <ul>
        <li>records successfully integrated beyond 8 days</li>
        <li>technical failures</li>
        <li>pending transfers</li>
      </ul>
      <p>
        The Data Platform is updated 14 days after the end of the month. This is
        so we can identify whether transfers started at the end of the month
        were integrated within the 8 day SLA.
      </p>
      <ul>
        <li data-testid="national-statistics__paper-fallback-count">{`Count: ${paperFallback.transferCount}`}</li>
        <li data-testid="national-statistics__paper-fallback-percent">{`Percent: ${paperFallback.transferPercentage}%`}</li>
      </ul>
    </>
  );
};

export default NationalStatistics;
