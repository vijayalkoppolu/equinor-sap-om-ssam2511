import ShowAccessoryButtonIcon from '../MaterialDocument/ShowAccessoryButtonIcon';
import MaterialHeaderButtonVisible from './MaterialHeaderButtonVisible';
import ODataLibrary from '../../OData/ODataLibrary';

/** @param {{binding: import('./ItemsData').ItemDetailsBinding}} context  */
export default function MaterialDocItemEditVisible(context) {
    const item = context.getPageProxy().getClientData().item || context.binding.item;
    if (item['@odata.type'].includes('PurchaseRequisitionHeader') || item['@odata.type'].includes('PurchaseRequisitionItem')) {
        const isLocal = ODataLibrary.isLocal(context.binding.item);
        if (!isLocal) {
            return false;
        }
    }
    if (!item['@odata.type'].includes('MaterialDocItem')) {
        return true;
    }
    return ShowAccessoryButtonIcon(context).then((icon) => {
        return icon && icon.length ? MaterialHeaderButtonVisible(context, true) : false;
    });
}
