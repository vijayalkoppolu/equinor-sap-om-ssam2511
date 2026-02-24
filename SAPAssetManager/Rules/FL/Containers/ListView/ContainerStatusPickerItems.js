import { ContainerStatus } from '../../Common/FLLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
/**
 * Fetches the list of container statuses for the picker
 * @param {IClientAPI} context
 */
export default async function ContainerStatusPickerItems(context) {
    let allowedStatuses = Object.values(ContainerStatus);
    if (libCom.getPageName(context) === 'FLFetchDocuments') {
        allowedStatuses = allowedStatuses.filter(status => status !== ContainerStatus.Received);
    }
    const statusFilters = allowedStatuses.map(status => `FldContainerStatus eq '${status}'`).join(' or ');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainerStatuses', [], `$filter=${statusFilters}&$orderby=FldContainerStatusDescription`)
        .then((containers) => [...Array.from(containers)]
        .map(container => ({
            'DisplayValue': `${container.FldContainerStatusDescription}`,
            'ReturnValue': `${container.FldContainerStatus}`,
        })));
}
