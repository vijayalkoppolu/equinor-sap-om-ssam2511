import HighPriorityOrdersRouteCount from '../OverviewPage/Meter/HighPriorityOrdersRouteCount';

/**
 * Returns a localized string with the number of high priority meter routes for the side menu item.
 * @param {IClientAPI} context
 * @returns {Promise<string>} Localized string with route count.
 */
export default async function SideDrawerMeterRoutesCount(context) {
    const count = await HighPriorityOrdersRouteCount(context);
    return `${context.localizeText('routes')} (${count})`;
}
