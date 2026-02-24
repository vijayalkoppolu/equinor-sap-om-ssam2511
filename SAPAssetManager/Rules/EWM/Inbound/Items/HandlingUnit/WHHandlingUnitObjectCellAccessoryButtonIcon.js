import ODataLibrary from '../../../../OData/ODataLibrary';

export default function WHHandlingUnitObjectCellAccessoryButtonIcon(context) {
    return ODataLibrary.hasAnyPendingChanges(context.binding) ? "$(PLT, sap-icon://delete, sap-icon://delete, '', sap-icon://delete)" : '';
}
