/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import CommonLibrary from '../../Common/Library/CommonLibrary';
import { CONTAINER_ITEMS_OPEN_FILTER, CONTAINER_ITEMS_RECEIVED_FILTER, CONTAINER_ITEMS_NOT_FOUND_FILTER } from './ContainerItemsListQueryOptions';
import {PACKAGE_ITEMS_OPEN_FILTER, PACKAGE_ITEMS_RECEIVED_FILTER, PACKAGE_ITEMS_NOT_FOUND_FILTER} from '../PackageItems/PackageItemsOnLoadQuery';
import { voyageStatusCode } from './ContainerItemsListQueryOptions';

export default async function OnDocumentSelectedOrUnselected(context) {
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding);
    const page = CommonLibrary.getPageName(context);
    const selecteditem = context.getPageProxy().getControls()[0].getSections()[0].getSelectionChangedItem().selected;
    const filter = context?.filters[0]?.filterItems[0];
    const voyageStatus = await voyageStatusCode(context);

    if (selecteditem) {
        CommonLibrary.setStateVariable(context, 'SelectedContainerItems', selectedItems);
    }
    if (selectedItems.length === 0) {

        CommonLibrary.setStateVariable(context, 'SelectedContainerItems', []);
        CommonLibrary.enableToolBar(context, page, 'ReceiveItem', false);
        CommonLibrary.enableToolBar(context, page, 'NotFoundItem', false);
        if ((filter === CONTAINER_ITEMS_OPEN_FILTER || filter === PACKAGE_ITEMS_OPEN_FILTER) && (!voyageStatus || voyageStatus === '02')) {
            CommonLibrary.switchToolBarVisibility(context, page, 'ReceiveAll', true);
            CommonLibrary.enableToolBar(context, page, 'EditAll', true);
        }
        if (filter === CONTAINER_ITEMS_RECEIVED_FILTER || filter === CONTAINER_ITEMS_NOT_FOUND_FILTER) {            
            CommonLibrary.switchToolBarVisibility(context, page, 'ReceiveAll', false);
            CommonLibrary.enableToolBar(context, page, 'EditAll', false);
        }
        
    } else {
        CommonLibrary.setStateVariable(context, 'SelectedContainerItems', selectedItems);
        CommonLibrary.switchToolBarVisibility(context, page, 'ReceiveAll', false);
        if ((filter === CONTAINER_ITEMS_OPEN_FILTER || filter === PACKAGE_ITEMS_OPEN_FILTER) && selectedItems.every(item => item.ContainerItemStatus !== '35') && (!voyageStatus || voyageStatus === '02')) {
            CommonLibrary.enableToolBar(context, page, 'ReceiveItem', true);
            CommonLibrary.enableToolBar(context, page, 'NotFoundItem', true);
            CommonLibrary.enableToolBar(context, page, 'EditAll', true);
        } else {
            CommonLibrary.enableToolBar(context, page, 'ReceiveItem', voyageStatus === '02');
            CommonLibrary.enableToolBar(context, page, 'NotFoundItem', false);
            CommonLibrary.enableToolBar(context, page, 'EditAll', true);
        }
        if (filter === CONTAINER_ITEMS_RECEIVED_FILTER || filter === CONTAINER_ITEMS_NOT_FOUND_FILTER || filter === PACKAGE_ITEMS_RECEIVED_FILTER || filter === PACKAGE_ITEMS_NOT_FOUND_FILTER) {
            CommonLibrary.enableToolBar(context, page, 'ReceiveItem', false);
            CommonLibrary.enableToolBar(context, page, 'NotFoundItem', false);
            CommonLibrary.enableToolBar(context, page, 'EditAll', false);
        }

    }

}
