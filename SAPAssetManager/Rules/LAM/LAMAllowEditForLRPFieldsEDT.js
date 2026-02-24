import EDTHelper from '../Measurements/Points/EDT/MeasuringPointsEDTHelper';
import LAMAllowEditForLRPFields from './LAMAllowEditForLRPFields';

/**
 * EDT extension uses isReadOnly instead of isEditable, so we need to reverse the result
 * @param {} context 
 * @returns Promise: Boolean
 */
export default async function LAMAllowEditForLRPFieldsEDT(context) {
    const isAllowed = await LAMAllowEditForLRPFields(context);
    const isLAM = EDTHelper.isLAMPoint(context.binding);
    return !(isAllowed && isLAM);
}
