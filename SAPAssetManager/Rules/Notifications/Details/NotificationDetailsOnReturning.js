import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';

//Set the enabled status of the toolbar and update buttons
export default function NotificationDetailsOnReturning(context) {
    context.evaluateTargetPathForAPI('#Section:NotificationItemsDataTable').redraw();
    return ToolbarRefresh(context);
}
