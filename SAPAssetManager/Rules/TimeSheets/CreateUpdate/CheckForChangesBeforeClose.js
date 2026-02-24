import CommonCheckForChangesBeforeClose from '../../Common/CheckForChangesBeforeClose';
import libAnalytics from '../../Extensions/EventLoggers/Analytics/AnalyticsLibrary';

export default function CheckForChangesBeforeClose(context) {
    return CommonCheckForChangesBeforeClose(context).then(() => {
        libAnalytics.timeEntryCreateCancel();
    });
}
