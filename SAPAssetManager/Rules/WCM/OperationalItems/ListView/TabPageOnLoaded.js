import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterSettings from '../../../Filter/FilterSettings';
import AssignedToLibrary from '../../Common/AssignedToLibrary';
import { OperationalItemSelVarAssignedToMeFilterTerm } from './ConstructOperationalItemsListViewTabs';

/** @param {IPageProxy} context currently selected tab's pageproxy */
export default function TabPageOnLoaded(context) {
    FilterSettings.applySavedFilterOnList(context, { AssignedToQuery: opItemIsAssignedToMeVisible });
    const parentPageName = CommonLibrary.getStateVariable(context, 'OperationalItemsListPageName');
    const operationalItemsListPage = context.evaluateTargetPath(`#Page:${parentPageName}`);
    const sectionedTable = context.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    if (sectionedTable === undefined) {  // first page onload: the sectionedtable may not be instantiated
        return;
    }
    FilterLibrary.setFilterActionItemText(context, operationalItemsListPage, sectionedTable);
}

function opItemIsAssignedToMeVisible(context, criteria) {
    const assignments = CommonLibrary.getWCMDocumentAssignmentTypes(context);
    if (!ValidationLibrary.evalIsEmpty(criteria.filterItems) && criteria.filterItems[0] === OperationalItemSelVarAssignedToMeFilterTerm()) {
        return AssignedToLibrary.IsAssignedToVisibleByAssignmentsSVOperationalItem(assignments);
    }
    return AssignedToLibrary.IsAssignedToVisibleByAssignmentsPartnerOperationalItem(assignments);
}
