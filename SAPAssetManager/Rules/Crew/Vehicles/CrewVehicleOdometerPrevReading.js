import point from './CrewVehicleOdometerPoint';
import libCom from '../../Common/Library/CommonLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';
import ODataLibrary from '../../OData/ODataLibrary';

export default function CrewVehicleOdometerPrevReading(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${point(context)}')/MeasurementDocs`, [], '$select=ReadingValue&$orderby=ReadingTimestamp desc').then(function(result) {
        if (result && result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                if (!ODataLibrary.isLocal(result.getItem(i))) {
                    let readingValue = result.getItem(i).ReadingValue;
                    if (libCom.isDefined(readingValue)) {
                        let decimal = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());
                        return context.formatNumber(readingValue, '', {maximumFractionDigits: decimal, minimumFractionDigits : 0});
                    }
                    return 0;
                }
            }
            return ValueIfExists('');
        } else {
            return ValueIfExists('');
        }
    });
}
