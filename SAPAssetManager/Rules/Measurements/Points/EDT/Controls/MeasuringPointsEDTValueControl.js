import libCommon from '../../../../Common/Library/CommonLibrary';
import libPoints from '../../../MeasuringPointLibrary';
import EDTHelper from '../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTValueControl(context) {
    let binding = context.binding;
    let isReadOnly = libCommon.IsOnCreate(context) ? !binding.CharName : libPoints.validateIsCounter(binding);

    let latestDoc = EDTHelper.getLatestLocalMeasurementDoc(context, binding.MeasurementDocs);
    let readingValue = latestDoc.ReadingValue;
    let parameters = {};
    if (readingValue !== undefined && latestDoc.HasReadingValue === 'X' && !(libCommon.getStateVariable(context, 'SingleReading') && libPoints.evalIsCreateTransaction(context))) {
        parameters = { 'Value': readingValue };
    }

    return {
        'Type': 'Number',
        'Name': 'ReadingValue',
        'IsMandatory': false,
        'IsReadOnly': isReadOnly,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/MeasuringPointsEDTValueControlOnValueChange.js',
        'Property': 'ReadingValue',
        'Parameters': parameters,
    };
}
