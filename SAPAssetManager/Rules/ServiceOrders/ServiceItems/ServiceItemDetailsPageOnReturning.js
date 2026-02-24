import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import IsIOS from '../../Common/IsIOS';
import PersonalizationPreferences from '../../UserPreferences/PersonalizationPreferences';
import ServiceItemTableEntitySet from './EDT/ServiceItemTableEntitySet';
import SubServiceItemQueryOptions from './SubItem/SubServiceItemQueryOptions';

export default function ServiceItemDetailsPageOnReturning(context) {
    resetSubItemsEdtTable(context);
    return ToolbarRefresh(context);
}

export async function resetSubItemsEdtTable(context) {
    if (await PersonalizationPreferences.isServiceItemTableView(context)) {
        const sectionedTable = context.getControl('SectionedTable');
        const subItemsEDTSection = sectionedTable.getSection('ServiceSubItemsTableSection');
        const subItemsObjectTableSection = sectionedTable.getSection('ServiceSubItems');

        if (subItemsObjectTableSection && subItemsEDTSection) {
            const itemsCount = await context.count('/SAPAssetManager/Services/AssetManager.service', 'S4ServiceItems', SubServiceItemQueryOptions(context, false, false));
            switchItemsSectionsVisibility(context, itemsCount, subItemsEDTSection, subItemsObjectTableSection);
        }
    }
}

export async function resetItemsEdtTable(context) {
    if (await PersonalizationPreferences.isServiceItemTableView(context)) {
        const sectionedTable = context.getControl('SectionedTable');
        const itemsEDTSection = sectionedTable.getSection('ServiceItemsTableSection');
        const itemsObjectTableSection = sectionedTable.getSection('ServiceItems');

        if (itemsObjectTableSection && itemsEDTSection) {
            const itemsCount = await context.count('/SAPAssetManager/Services/AssetManager.service', ServiceItemTableEntitySet(context), '');

            switchItemsSectionsVisibility(context, itemsCount, itemsEDTSection, itemsObjectTableSection);
        }
    }
}

function switchItemsSectionsVisibility(context, itemsCount, itemsEDTSection, itemsObjectTableSection) {
    if (itemsCount === 0) {
        itemsEDTSection.setVisible(false);
        itemsObjectTableSection.setVisible(true);
    } else {
        itemsObjectTableSection.setVisible(false);
        itemsEDTSection.setVisible(true).then(() => {
            const edtExtension = itemsEDTSection?.getExtension();
            if (edtExtension && IsIOS(context)) {
                edtExtension.onCreate();
            }
        });
    }
}
