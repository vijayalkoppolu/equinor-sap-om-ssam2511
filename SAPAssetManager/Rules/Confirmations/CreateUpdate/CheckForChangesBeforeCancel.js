import CommonCheckForChangesBeforeCancel from '../../Common/CheckForChangesBeforeCancel';
import libAnalytics from '../../Extensions/EventLoggers/Analytics/AnalyticsLibrary';

export default function CheckForChangesBeforeCancel(context) {
    return CommonCheckForChangesBeforeCancel(context).then(() => {
        libAnalytics.timeEntryCreateCancel();
    });
}
