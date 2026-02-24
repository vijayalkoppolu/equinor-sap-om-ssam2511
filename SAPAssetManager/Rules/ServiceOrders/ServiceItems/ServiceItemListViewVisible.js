import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import ServiceItemTableEntitySet from './EDT/ServiceItemTableEntitySet';

/**
* Return visibility of the section based on current service items view preference
* @param {IClientAPI} context
*/
export default async function ServiceItemListViewVisible(context) {
    if (await PersonalizationPreferences.isServiceItemTableView(context)) {
        const itemsCount = await context.count('/SAPAssetManager/Services/AssetManager.service', ServiceItemTableEntitySet(context.getPageProxy()), '');
        return itemsCount === 0;
    }

    return true;
}
