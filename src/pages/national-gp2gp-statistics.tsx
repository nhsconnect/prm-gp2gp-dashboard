import React from "react";
import { Helmet } from "react-helmet";
import { Table } from "../components/common/Table";
import { convertMonthNumberToText } from "../library/utils/convertMonthNumberToText";
import { addPercentageSign } from "../library/utils/addPercentageSign";
import { convertToReadableNum } from "../library/utils/convertToReadableNum";
// @ts-ignore
import nationalMetrics from "../data/organisations/nationalMetrics.json";

type NationalStatisticsMetric = {
  year: number;
  month: number;
  transferCount: number;
  integratedOnTime: TransferMetrics;
  paperFallback: PaperFallbackMetrics;
};

type TransferMetrics = {
  transferCount: number;
  transferPercentage: number;
};

type PaperFallbackMetrics = TransferMetrics & {
  processFailure: ProcessFailureMetrics;
  technicalFailure: TransferMetrics;
  unclassifiedFailure: TransferMetrics;
};

type ProcessFailureMetrics = {
  integratedLate: TransferMetrics;
  transferredNotIntegrated: TransferMetrics;
};

const NationalStatistics = () => {
  const {
    month,
    year,
    transferCount,
    paperFallback,
    integratedOnTime,
  }: NationalStatisticsMetric = nationalMetrics.metrics[0];
  const monthName = convertMonthNumberToText(month);

  return (
    <>
      <Helmet>
        <title>National Statistics - GP Registrations Data</title>
        <meta
          name="description"
          content="National monthly data about GP2GP transfers"
        />
      </Helmet>
      <div className="nhsuk-u-reading-width">
        <h1>National GP2GP patient record transfers data</h1>
        <p>
          This page provides monthly national data about GP2GP transfers for
          practices in England.
        </p>
        <p>
          This site is updated 14 days after the end of each month. This is to
          identify whether transfers started at the end of the month were
          integrated within 8 days. When records are not integrated within 8
          days, GP2GP requests that a full paper copy is printed and sent to the
          practice.
        </p>
        <p>
          Every transfer shown on the site is categorised 14 days after it
          started.
        </p>
        <p>
          For example, a transfer started on the 2nd February and not integrated
          by the 15th February would be categorised as 'transferred, not
          integrated'.
        </p>
        <p>
          Values presented as percentages are rounded to the nearest two decimal
          places.
        </p>
        <h2>
          GP2GP National Performance for {monthName} {year}
        </h2>
        <p>
          Figures are based on transfers started between the 1st and the last
          day of the month, inclusive.
        </p>
        <h3>Transfers started</h3>
        <p>
          Transfers that were started, regardless of whether the request was
          successful or failed.
        </p>
        <ul>
          <li data-testid="national-statistics__initiated-count">{`Count: ${convertToReadableNum(
            transferCount
          )}`}</li>
        </ul>
        <h3>Successful integrations within 8 days</h3>
        <p>
          Transfers that were integrated (filed or suppressed) by the receiving
          practice within 8 days.
        </p>
        <ul>
          <li data-testid="national-statistics__integrated-count">{`Count: ${convertToReadableNum(
            integratedOnTime.transferCount
          )}`}</li>
          <li data-testid="national-statistics__integrated-percent">{`Percent: ${addPercentageSign(
            integratedOnTime.transferPercentage
          )}`}</li>
        </ul>
        <h3>Paper fallback transfers</h3>
        <p>
          This includes any successful or failed GP2GP requests that triggered
          the paper fallback process and created extra burden for practices.
        </p>
        <p>This includes:</p>
        <ul>
          <li>Process Failures</li>
          <li>Technical Failures</li>
          <li>Unclassified Failures</li>
        </ul>
        <ul>
          <li data-testid="national-statistics__paper-fallback-count">{`Count: ${convertToReadableNum(
            paperFallback.transferCount
          )}`}</li>
          <li data-testid="national-statistics__paper-fallback-percent">{`Percent: ${addPercentageSign(
            paperFallback.transferPercentage
          )}`}</li>
        </ul>
        <h4>Process failures</h4>
        <p>Transfers that either:</p>
        <ul>
          <li>have not been integrated within 14 days, or</li>
          <li>have been successfully integrated but beyond 8 days</li>
        </ul>
        <p>
          These transfers result in the paper fallback process being triggered.
        </p>
        <h5>Transferred, not integrated</h5>
        <p>
          Transfers that have been sent but have not been integrated for at
          least 14 days.
        </p>
        <ul>
          <li data-testid="national-statistics__transferred-not-int-count">{`Count: ${convertToReadableNum(
            paperFallback.processFailure.transferredNotIntegrated.transferCount
          )}`}</li>
          <li data-testid="national-statistics__transferred-not-int-percent">{`Percent: ${addPercentageSign(
            paperFallback.processFailure.transferredNotIntegrated
              .transferPercentage
          )}`}</li>
        </ul>
        <h5>Integrated late (beyond 8 days)</h5>
        <p>
          The number of successful integrations that were integrated (filed or
          suppressed) beyond 8 days of the record being sent. These transfers
          result in the paper fallback process being triggered.
        </p>
        <ul>
          <li data-testid="national-statistics__int-late-count">{`Count: ${convertToReadableNum(
            paperFallback.processFailure.integratedLate.transferCount
          )}`}</li>
          <li data-testid="national-statistics__int-late-percent">{`Percent: ${addPercentageSign(
            paperFallback.processFailure.integratedLate.transferPercentage
          )}`}</li>
        </ul>
        <h4>Technical failures</h4>
        <p>
          Records that fail to transfer either due to a technical error, or due
          to the transfer getting stuck in transit with an unreported technical
          issue. These transfers result in the paper fallback process being
          triggered, and a break in the continuity of the record as the EHR is
          not received.
        </p>
        <ul>
          <li data-testid="national-statistics__failed-count">
            {`Count: ${convertToReadableNum(
              paperFallback.technicalFailure.transferCount
            )}`}
          </li>
          <li data-testid="national-statistics__failed-percent">
            {`Percent: ${addPercentageSign(
              paperFallback.technicalFailure.transferPercentage
            )}`}
          </li>
        </ul>
        <h4>Unclassified failures</h4>
        <p>
          Transfers that we are currently unable to confidently classify as
          technical or process error.
        </p>
        <ul>
          <li data-testid="national-statistics__unclassified-count">
            {`Count: ${convertToReadableNum(
              paperFallback.unclassifiedFailure.transferCount
            )}`}
          </li>
          <li data-testid="national-statistics__unclassified-percent">
            {`Percent: ${addPercentageSign(
              paperFallback.unclassifiedFailure.transferPercentage
            )}`}
          </li>
        </ul>
      </div>
    </>
  );
};

export default NationalStatistics;
