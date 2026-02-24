import CommonLibrary from '../../../../../../Common/Library/CommonLibrary';
import MeasuringPointLibrary from '../../../../../MeasuringPointLibrary';
import EDTHelper from '../../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTUomValue(context) {
    if (EDTHelper.isNotLAMPoint(context.binding)) return '';

    let measurements = context.binding.MeasurementDocs;
    let latestDoc = EDTHelper.getLatestLocalMeasurementDoc(context, measurements);
    let value = EDTHelper.getLAMPropertyValue(context, latestDoc.LAMObjectDatum_Nav, 'UOM');

    if (CommonLibrary.getStateVariable(context, 'SingleReading') && !MeasuringPointLibrary.evalIsUpdateTransaction(context)) {
        value = EDTHelper.getLAMPropertyValue(context, context.binding.LAMObjectDatum_Nav, 'UOM');
    }

    return value || '';
}
