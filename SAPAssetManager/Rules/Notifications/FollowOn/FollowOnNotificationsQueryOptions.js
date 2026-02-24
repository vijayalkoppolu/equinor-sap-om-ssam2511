import CommonLibrary from '../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function FollowOnNotificationsQueryOptions(context) {
    let searchString = context.searchString;
    let filter = `$filter=RefObjectKey eq '${context.binding.OrderId}'`;
    if (searchString) {
        filter += ' and ' + getSearchQuery(context, searchString.toLowerCase());
    }

    filter += '&$expand=NotifPriority,NotifMobileStatus_Nav'; //Handle object card display on WO details
    
    return filter + '&$orderby=Priority desc';
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['NotificationDescription', 'NotificationNumber', 'NotificationType'];
        ModifyListViewSearchCriteria(context, 'MyNotificationHeader', searchByProperties);

        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
