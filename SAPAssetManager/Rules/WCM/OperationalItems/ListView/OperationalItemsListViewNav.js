import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { NavToRelatedOperationalItemsListPage } from './CertificateRelatedOperationalItemsListViewNav';

export const OPERATIONAL_ITEMS_LIST_VIEW_PAGE = 'OperationalItemsListViewPage';

export default function OperationalItemsListViewNav(context) {
    CommonLibrary.setStateVariable(context, 'OperationalItemsListPageName', OPERATIONAL_ITEMS_LIST_VIEW_PAGE);
    return NavToRelatedOperationalItemsListPage(context, OPERATIONAL_ITEMS_LIST_VIEW_PAGE);
}
