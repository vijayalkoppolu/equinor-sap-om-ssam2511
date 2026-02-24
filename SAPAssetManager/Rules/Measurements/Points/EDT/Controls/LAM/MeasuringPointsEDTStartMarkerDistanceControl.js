import CommonLibrary from '../../../../../Common/Library/CommonLibrary';
import MeasuringPointLibrary from '../../../../MeasuringPointLibrary';
import EDTHelper from '../../MeasuringPointsEDTHelper';
import { getLinearDataDistance } from './MeasuringPointsEDTDistanceOnValueChange';

export default async function MeasuringPointsEDTStartMarkerDistanceControl(context) {
    let measurements = context.binding.MeasurementDocs;
    let parameters = EDTHelper.getLAMNumericControlParameters(context, measurements, 'StartMarkerDistance');

    if (CommonLibrary.getStateVariable(context, 'SingleReading') && !MeasuringPointLibrary.evalIsUpdateTransaction(context)) {
        const lam = context.binding.LAMObjectDatum_Nav || {};
        const distance = await getLinearDataDistance(context, lam.LRPId, lam.StartPoint, lam.StartMarker);
        parameters = distance !== undefined ? {'Value' : distance} : {};
    }

    const isReadOnly = EDTHelper.isNotLAMPoint(context.binding);
    if (isReadOnly) {
        parameters = {};
    }

    return {
        'Type': 'Number',
        'Name': 'StartMarkerDistance',
        'IsMandatory': false,
        'IsReadOnly': isReadOnly,
        'OnValueChange': '/SAPAssetManager/Rules/Measurements/Points/EDT/Controls/LAM/MeasuringPointsEDTDistanceOnValueChange.js',
        'Property': 'LAMObjectDatum_Nav/StartMarkerDistance',
        'Parameters': parameters,
    };
}
