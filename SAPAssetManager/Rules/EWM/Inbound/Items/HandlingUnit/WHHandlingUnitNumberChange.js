import libVal from '../../../../Common/Library/ValidationLibrary';

export default function WHHandlingUnitNumberChange(context) {
    const value = context?._control?.getValue();

    if (!libVal.evalIsNumeric(value)) {
        context?._control?.applyValidation(context.localizeText('validate_numeric_hu_number'));
        return false;
    }
    context?._control?.clearValidation();
    return true;
}
