import libCommon from '../../../../../Common/Library/CommonLibrary';
import libPoints from '../../../../MeasuringPointLibrary';
import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTShortTextValue(context) {
    let latestDoc = EDTHelper.getLatestMeasurementDoc(context, context.binding);

    if (latestDoc.ShortText && !(libCommon.getStateVariable(context, 'SingleReading') && libPoints.evalIsCreateTransaction(context))) {
        return latestDoc.ShortText;
    }

    return '';
}
