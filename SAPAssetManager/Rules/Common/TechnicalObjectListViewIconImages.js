import AttachedDocumentIcon from '../Documents/AttachedDocumentIcon';
import ODataLibrary from '../OData/ODataLibrary';

export default function TechnicalObjectListViewIconImages(context) {
    const binding = context.binding;
    const isEquipment = binding['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue();
    return isEquipment ? GetEquipmentIconImages(context, binding) : GetFlocIconImages(context, binding);
}

/** @param {MyFunctionalLocation} floc  */
export function GetFlocIconImages(context, floc) {
    const docs = floc.FuncLocDocuments || [];
    return GetIconImages(context, ODataLibrary.hasAnyPendingChanges(floc), docs);
}

/** @param {MyEquipment} equipment  */
export function GetEquipmentIconImages(context, equipment) {
    const docs = equipment.EquipDocuments || [];
    return GetIconImages(context, ODataLibrary.hasAnyPendingChanges(equipment), docs);
}

function GetIconImages(context, islocal, docs) {
    const iconImage = [];

    if (islocal || docs.some(doc => ODataLibrary.hasAnyPendingChanges(doc))) {
        iconImage.push('sap-icon://synchronize');
    }

    // check if this FLOC has any docs
    const docIcon = AttachedDocumentIcon(context, docs);
    if (docIcon) {
        iconImage.push(docIcon);
    }

    return iconImage;
}
