import { FLEntitySetNames } from '../../Common/FLLibrary';

export default function HUDelItemsProductDetailsEntitySet(context) {
    const entityType = context.binding?.['@odata.type'];

    if (entityType === '#sap_mobile.FldLogsHuDelItem') {
        return FLEntitySetNames.HuDelItemSerialNos;
    } else if (entityType === '#sap_mobile.FldLogsContainerItem') {
        return FLEntitySetNames.ContainerItemSerialNos;
    } else if (entityType === '#sap_mobile.FldLogsPackageItem') {
        return FLEntitySetNames.PackageItemSerialNos;
    }
}
