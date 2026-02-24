import CommonLibrary from '../../../../../Common/Library/CommonLibrary';
import MeasuringPointLibrary from '../../../../MeasuringPointLibrary';
import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTLengthControl(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'Length');

    if (CommonLibrary.getStateVariable(context, 'SingleReading') && !MeasuringPointLibrary.evalIsUpdateTransaction(context)) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'Length');
    }

    const isReadOnly = EDTHelper.isNotLAMPoint(context.binding);
    if (isReadOnly) {
        parameters = {};
    }

    return {
        'Type': 'Number',
        'Name': 'Length',
        'IsMandatory': false,
        'IsReadOnly': isReadOnly,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/MeasuringPointsEDTOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/Length',
        'Parameters': parameters,
    };
}
