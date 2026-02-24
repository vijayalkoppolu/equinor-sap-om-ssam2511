import libCommon from '../../../../Common/Library/CommonLibrary';

export default function WHHandlingUnitCreateRequiredFields(context) {
    const pageName = libCommon.getPageName(context);
    const requiredFields = ['PackagingMaterialPicker'];

    if (pageName === 'WHHandlingUnitCreatePage') {
        requiredFields.push('NumberOfHUs', 'QtyToPack');
    }

    return requiredFields;
}
