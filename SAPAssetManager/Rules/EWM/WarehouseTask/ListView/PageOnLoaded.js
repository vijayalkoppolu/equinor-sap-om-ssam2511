import { SaveTasksToPageData } from '../Details/TaskArray';
import ListPageWithFilterOnLoaded from '../../../Filter/ListPageWithFilterOnLoaded';

/**
 * Save the Tasks of the Warehouse Order
 * @param {IPageProxy} pageProxy 
 */
export default function PageOnLoaded(pageProxy) {
    SaveTasksToPageData(pageProxy);
    ListPageWithFilterOnLoaded(pageProxy);
}
