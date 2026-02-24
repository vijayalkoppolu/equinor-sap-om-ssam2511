import ODataLibrary from '../../../../OData/ODataLibrary';

export default function WHHandlingUnitObjectCellIcons(context) {
    const icons = [];

    if (ODataLibrary.hasAnyPendingChanges(context.binding)) {
        icons.push('sap-icon://synchronize');
    }

    return icons;
}
