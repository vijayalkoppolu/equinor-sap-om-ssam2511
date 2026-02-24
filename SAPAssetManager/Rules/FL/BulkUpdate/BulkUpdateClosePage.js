import libCom from '../../Common/Library/CommonLibrary';

export default function BulkUpdateClosePage(context) {
    const previousPage = libCom.getPreviousPageName(context);
    const modalPages = ['BulkFLEdit', 'FLBulkWOUpdate', 'FLPBulkWOUpdate', 'BulkFLPackContainerEdit', 'BulkFLReadyToPackEdit'];
    const isModal = modalPages.includes(previousPage);

    return context.executeAction({
        Name: '/SAPAssetManager/Actions/Page/ClosePage.action',
        Properties: {
            DismissModal: isModal ? '' : 'Action.Type.ClosePage.Completed',
            NavigateBackToPage: previousPage,
        },
    });
}
