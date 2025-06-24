from prmreportsgenerator.config import PipelineConfig
from prmreportsgenerator.report_name import ReportName


def create_pipeline_config(**kwargs) -> PipelineConfig:
    return PipelineConfig(
        input_transfer_data_bucket="input-transfer-data-bucket",
        output_reports_bucket="output-reports-bucket",
        s3_endpoint_url=None,
        build_tag="123",
        start_datetime=kwargs.get("start_datetime", None),
        end_datetime=kwargs.get("end_datetime", None),
        number_of_months=kwargs.get("number_of_months", None),
        number_of_days=kwargs.get("number_of_days", None),
        cutoff_days=kwargs.get("cutoff_days", None),
        report_name=ReportName.TRANSFER_OUTCOMES_PER_SUPPLIER_PATHWAY,
        alert_enabled=True,
        send_email_notification=True,
    )
