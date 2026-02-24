import LAMLinearReferencePatternValue from './LAMLinearReferencePatternValue';

/**
 * Check to see if LRP value exists for the current point
 * Certain LAM fields should not be editable if LRP value is not present
 * @param {*} context 
 * @returns Promise: Boolean
 */
export default async function LAMAllowEditForLRPFields(context) {
    const lrpValue = await LAMLinearReferencePatternValue(context);

    if (lrpValue) return true;
    return false;
}
