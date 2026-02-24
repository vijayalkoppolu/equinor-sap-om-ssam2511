import ComLib from '../Common/Library/CommonLibrary';
import TelemetryLib from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function ReminderCreateNav(clientAPI) {
    //Set the global TransactionType variable to CREATE
    ComLib.setOnCreateUpdateFlag(clientAPI, 'CREATE');
    TelemetryLib.executeActionWithLogUserEvent(clientAPI, 
        '/SAPAssetManager/Actions/Reminders/ReminderCreateUpdateNav.action',
        clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Features/Reminders.global').getValue(),
        TelemetryLib.EVENT_TYPE_CREATE);
}
