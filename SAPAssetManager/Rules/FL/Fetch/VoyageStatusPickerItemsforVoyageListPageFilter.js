import { VoyageDownloadFiltersAllowed } from '../Common/FLLibrary';

export default async function VoyageStatusPickerItemsforVoyageListPageFilter(clientAPI) {
    const statusFilters = Object.values(VoyageDownloadFiltersAllowed).map(status => `VoyageStatusCodeType eq '${status}'`).join(' or ');
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsVoyageStatusCodeTypes', [], `$filter=${statusFilters}&$orderby=Description`)
        .then((statuses) => Array.from(statuses)
        .map(status => ({
            'DisplayValue': `${status.Description}`,
            'ReturnValue': `${status.VoyageStatusCodeType}`,
        })));
}
