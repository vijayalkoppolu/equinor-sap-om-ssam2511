import CommonLibrary from '../../Common/Library/CommonLibrary';
import FilterSettings from '../../Filter/FilterSettings';
import AssignedToLibrary from './AssignedToLibrary';


export default function ListPageWithAssignedToMePermitOnLoaded(context) {
    FilterSettings.saveInitialFilterForPage(context);
    FilterSettings.applySavedFilterOnList(context, { AssignedToQuery: (ctx) => AssignedToLibrary.IsAssignedToVisibleByAssignmentsWorkPermit(CommonLibrary.getWCMApplicationAssignmentTypes(ctx)) });
    context.getControl('SectionedTable').redraw(true);
}
