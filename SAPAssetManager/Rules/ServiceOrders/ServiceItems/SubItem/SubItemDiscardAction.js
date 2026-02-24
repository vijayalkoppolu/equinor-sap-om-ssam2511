import libCom from '../../../Common/Library/CommonLibrary';
import { resetItemsEdtTable, resetSubItemsEdtTable } from '../ServiceItemDetailsPageOnReturning';

export default function SubItemDiscardAction(context) {
    const pageProxy = context.currentPage.context.clientAPI;

    return pageProxy.executeAction('/SAPAssetManager/Actions/DiscardWarningMessage.action').then(successResult => {
        if (successResult.data) {
            pageProxy.setActionBinding(context.binding);
            return pageProxy.executeAction({
                Name: '/SAPAssetManager/Actions/ServiceItems/ServiceItemDelete.action',
                Properties: {
                    OnSuccess: '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessageNoClosePage.action',
                },
            }).then(() => {
                if (libCom.getPageName(pageProxy) === 'ServiceOrderDetailsPage') {
                    resetItemsEdtTable(pageProxy);
                } else if (libCom.getPageName(pageProxy) === 'ServiceItemsTableViewPage') {
                    pageProxy.redraw();
                } else {
                    resetSubItemsEdtTable(pageProxy);
                }
            });
        }
        return Promise.resolve();
    });
}
