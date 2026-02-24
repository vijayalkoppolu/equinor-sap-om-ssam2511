import TimeCaptureTypeHelper from './TimeCaptureTypeHelper';
import {ConfirmationsFetchRequest} from '../../Confirmations/Fetch/ConfirmationsFetchRequest';
import {TimeSheetDetailsLibrary} from '../../TimeSheets/TimeSheetLibrary';
import FetchRequest from '../../Common/Query/FetchRequest';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import ODataDate from '../../Common/Date/ODataDate';
import isAndroid from '../../Common/IsAndroid';
import ODataLibrary from '../../OData/ODataLibrary';

export default function TimeCaptureSectionYesterdayIcons(context) {

    return TimeCaptureTypeHelper(context, ConfirmationIcons, TimeSheetIcons);
}

function TimeSheetIcons(context) {

    let date = TimeSheetDetailsLibrary.TimeSheetCreateUpdateDate(context, yesterday());

    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`Date eq datetime'${date}'`);
    let fetchRequest = new FetchRequest('CatsTimesheets', queryBuilder.build());

    return fetchRequest.execute(context).then(results => {
        let icons = [];

        results.some(timesheet => {
            if (ODataLibrary.hasAnyPendingChanges(timesheet)) {
                icons.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return true;
            }
            return false;
        });
        return icons;
    });
}

function ConfirmationIcons(context) {

    let date = yesterday();
    let odataDate = new ODataDate(date);

    let fetchRequest = new ConfirmationsFetchRequest(context, odataDate);

    return fetchRequest.execute(context).then(results => {

        let icons = [];

        results.some(conf => {
            if (ODataLibrary.hasAnyPendingChanges(conf)) {
                icons.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
                return true;
            }
            return false;
        });
        return icons;
    });
}

function yesterday() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
}
