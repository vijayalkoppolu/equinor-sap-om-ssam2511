import point from './CrewVehicleOdometerPoint';
import {ValueIfExists} from '../../Common/Library/Formatter';
import libVal from '../../Common/Library/ValidationLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import ODataLibrary from '../../OData/ODataLibrary';

export default function CrewVehicleOdometerPrevReadingDate(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${point(context)}')/MeasurementDocs`, [], '$select=ReadingDate,ReadingTime&$orderby=ReadingTimestamp desc').then(function(result) {
        if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                if (!ODataLibrary.isLocal(result.getItem(i))) {
                    if (!libVal.evalIsEmpty(result.getItem(i).ReadingDate)) {
                        //Construct the datetime compatible with formatDate.  Appears to be converting automatically from UTC to local time?
                        let dateConvert = OffsetODataDate(context, result.getItem(i).ReadingDate, result.getItem(i).ReadingTime);
                        return context.formatDate(dateConvert.date());
                    } else {
                        return ValueIfExists('');
                    }
                }
            }
            return ValueIfExists('');
        } else {
            return ValueIfExists('');
        }
    });
}
