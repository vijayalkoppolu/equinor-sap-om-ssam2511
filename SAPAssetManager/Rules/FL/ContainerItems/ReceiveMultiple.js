import { getItems } from './ReceiveAll';
import libCom from '../../Common/Library/CommonLibrary';
import FLDocumentUpdate from '../Edit/FLDocumentUpdate';
import { ContainerItemStatus } from '../Common/FLLibrary';
import Logger from '../../Log/Logger';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ReceiveMultiple(clientAPI) {
const items = getItems(clientAPI);
const section = clientAPI.getPageProxy().getControl('SectionedTable');
Promise.all(items.map(item => ReceiveItem(clientAPI, item)))
    .then(() => {
        // Workaround suggested in MDKBUG-1391
        // Setting the filters will redraw the FilterFeedbackBar.
        // Triggering section redraw with true param would force full redraw instead of row redraw.
        const currentFilters = section.filters;
        section.filters = currentFilters;
        section.redraw();
        const page = libCom.getPageName(clientAPI);
        libCom.enableToolBar(clientAPI, page, 'ReceiveItem', false);
    })
    .catch(error => {
        Logger.error('FLReceive', error);
    });
}

export function ReceiveItem(clientAPI,item) {
    if (!item) {
        return Promise.resolve(false);
    }   
    item.ActionType = 'RECEIVE';
    item.ContainerItemStatus =  ContainerItemStatus.Received;  
    if (!(item.HandlingDecision && item.DestStorLocID)) {
        libCom.setStateVariable(clientAPI, 'Receive', true);
        clientAPI.getPageProxy().setActionBinding(item);
        // Navigate to EditFLDocument page
        return clientAPI.executeAction('/SAPAssetManager/Actions/FL/Edit/EditFLDocumentPageNav.action');
    }
    return FLDocumentUpdate(clientAPI, item);
}
