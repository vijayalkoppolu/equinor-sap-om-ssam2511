import libVal from '../Common/Library/ValidationLibrary';
import Logger from '../Log/Logger';

/**
 * For display of the Last Sync, pull the most recent 'download' entry from the EventLog entity
 * set and return the Time field properly formatted for local time.  Because the Time field
 * is an Edm.DateTimeOffset field, we do not need to adjust for local timezone.
 * @param {ClientAPI} context 
 */
export default function LastSyncCaption(context) {
    return GetLastSyncDateTime(context).then(date => {
        if (libVal.evalIsNotEmpty(date)) {
            try {
                return context.localizeText('last_sync', [context.formatDatetime(date)]);
            } catch (error) {
                Logger.error('LastSyncCaption', error);
                return '-';
            }     
        } else {
            return '-';
        }
    });
}

export function GetLastSyncDateTime(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EventLog', [], "$filter=Type eq 'download'&$top=1&$orderby=Time desc").then(data => {
        if (libVal.evalIsNotEmpty(data)) {
            try {
                return new Date(data.getItem(0).Time);
            } catch (error) {
                Logger.error('GetLastSyncDateTime', error);
                return null;
            }     
        } else {
            return null;
        }
    });
}
