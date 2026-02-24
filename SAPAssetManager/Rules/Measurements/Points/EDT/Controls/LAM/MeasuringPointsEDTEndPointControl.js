import CommonLibrary from '../../../../../Common/Library/CommonLibrary';
import MeasuringPointLibrary from '../../../../MeasuringPointLibrary';
import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTEndPointControl(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'EndPoint');

    if (CommonLibrary.getStateVariable(context, 'SingleReading') && !MeasuringPointLibrary.evalIsUpdateTransaction(context)) {
        parameters = EDTHelper.getParentPointLAMNumericControlParameters(context, 'EndPoint');
    }
    
    const isReadOnly = EDTHelper.isNotLAMPoint(context.binding);
    if (isReadOnly) {
        parameters = {};
    }

    return  {
        'Type': 'Number',
        'Name': 'EndPoint',
        'IsMandatory': false,
        'IsReadOnly': isReadOnly,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/EndPoint',
        'Parameters': parameters,
    };
}
