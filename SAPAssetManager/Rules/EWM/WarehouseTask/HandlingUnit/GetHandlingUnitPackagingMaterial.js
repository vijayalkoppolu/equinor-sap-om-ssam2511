import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetHandlingUnitPackagingMaterial(context) {

    // for local update scenarios, we need to get the HU from the warehousetaskconfirmation entity
    if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        return context.binding?.WarehousePickHUTaskC_Nav?.PackMaterial
            ? context.binding.WarehousePickHUTaskC_Nav.PackMaterial
            : context.binding?.WarehousePickHUTaskC_Nav?.Product
                ? context.binding.WarehousePickHUTaskC_Nav.Product
                : CommonLibrary.getStateVariable(context, 'InputtedPackagingMaterialValue');
    } else if (context.binding['@odata.type'] === '#sap_mobile.WarehouseTask') {
        return CommonLibrary.getStateVariable(context, 'InputtedPackagingMaterialValue');
    } else {
        return '';
    }

}
