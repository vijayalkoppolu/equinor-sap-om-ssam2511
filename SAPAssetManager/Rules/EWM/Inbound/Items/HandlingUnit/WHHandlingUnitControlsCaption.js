import libCommon from '../../../../Common/Library/CommonLibrary';

export default function WHHandlingUnitRequiredControlsCaption(context) {
    let key = '';

    switch (context.getName()) {
        case 'QtyToPack':
            key = 'quantity_to_pack';
            break;
        case 'PackagingMaterialPicker':
            key = 'packaging_material';
            break;
        case 'NumberOfHUs':
            key = 'number_of_hus';
            break;    
        default:
            break;
    }

    return libCommon.formatCaptionWithRequiredSign(context, key, true);
}
