import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';
import TelemetryLibrary from '../../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function PartIssueSuccessWithAutoSync(context) {
  TelemetryLibrary.logUserEvent(context,
    context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Parts.global').getValue(),
    TelemetryLibrary.EVENT_TYPE_ISSUE);
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Parts/PartIssueSuccess.action');
}
