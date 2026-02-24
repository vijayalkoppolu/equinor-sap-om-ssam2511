import Logger from './Logger';
import NativeScriptObject from '../Common/Library/NativeScriptObject';
import TelemetryLibrary from '../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default async function InitializeLoggerAndNativeScriptObject(clientAPI) {
  // Log file is located in Application's Documents folder.
    Logger.init(clientAPI);
    NativeScriptObject.init(clientAPI);
    return TelemetryLibrary.init(clientAPI);
}
