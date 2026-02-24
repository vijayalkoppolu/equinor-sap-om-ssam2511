import point from './CrewVehicleOdometerPoint';
import libCom from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default function CrewVehicleOdometerReadingDefault(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${point(context)}')/MeasurementDocs`, [], '$select=ReadingValue&$top=1&$orderby=ReadingTimestamp desc').then(function(result) {
        if (result && result.length > 0) {
            if (ODataLibrary.isLocal(result.getItem(0))) {
                let readingValue = result.getItem(0).ReadingValue;
                if (libCom.isDefined(readingValue)) {
                    let decimal = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());
                    return context.formatNumber(readingValue, '', {maximumFractionDigits: decimal, minimumFractionDigits : 0});
                }
                return 0;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    });
}
