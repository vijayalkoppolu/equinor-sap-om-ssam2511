import EDTHelper from '../../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTIsNotLamPoint(context) {
    return EDTHelper.isNotLAMPoint(context.binding);
}
