import CommonLibrary from '../../../Common/Library/CommonLibrary';

export const CERTIFICATE_RELATED_OPERATIONAL_ITEMS_LIST_VIEW_PAGE = 'CertificateRelatedOperationalItemsListViewPage';

export default function CertificateRelatedOperationalItemsListViewNav(context) {
    CommonLibrary.setStateVariable(context, 'OperationalItemsListPageName', CERTIFICATE_RELATED_OPERATIONAL_ITEMS_LIST_VIEW_PAGE);
    return NavToRelatedOperationalItemsListPage(context, CERTIFICATE_RELATED_OPERATIONAL_ITEMS_LIST_VIEW_PAGE);
}

export function NavToRelatedOperationalItemsListPage(context, relatedToName) {
    const page = context.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/WCM/OperationalItems/OperationalItemsListView.page');
    page._Name = relatedToName;
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemsListViewNav.action',
        'Properties': {
            'PageMetadata': page,
        },
    });
}
