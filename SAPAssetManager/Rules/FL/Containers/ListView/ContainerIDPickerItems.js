import libCom from '../../../Common/Library/CommonLibrary';
/**
* @param {IClientAPI} context
*/
export default async function ContainerIDPickerItems(context, entitySetName = undefined) {
    const pageName = libCom.getPageName(context);
    let entitySet = entitySetName;
    if (!entitySet) {
        switch (pageName) {
            case 'ContainersSearchFilterPage':
                entitySet = 'FldLogsContainers';
                break;
            case 'PackagesSearchFilterPage':
                entitySet = 'FldLogsPackages';
                break;
            default:
                return Promise.resolve([]);
        }
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], '$orderby=ContainerID')
    .then((containers) => [... new Set(Array.from(containers, c => c.ContainerID))]
        .map(uniqueContainer => ({
            'DisplayValue': `${uniqueContainer}`,
            'ReturnValue': `${uniqueContainer}`,
        })));
}
