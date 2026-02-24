import FilterSettings from '../../../../Filter/FilterSettings';
import { redrawFilter } from '../../../Common/FLLibrary';
import libCom from '../../../../Common/Library/CommonLibrary';
/**
* Saves initial filters set for page
* Applies filter criteria saved in 'UserPreferences' table for current page to sectionedTable filters, if there are any
* @param {IClientAPI} context
*/
export default function ListPageWithFilterOnLoaded(context,pageName = 'FLProductsList', objectTable = 'SectionObjectTable') {
    FilterSettings.applySavedFilterOnList(context);
    libCom.setStateVariable(context, 'BulkFLUpdateNav',false);
    const headerPage = context.evaluateTargetPath('#Page:FLWorkOrderDetailView');
    headerPage?.redraw();
    const productPage = context.evaluateTargetPath(`#Page:${pageName}`);
    return redrawFilter('SectionedTable', objectTable,productPage.context?._clientAPI);
}
