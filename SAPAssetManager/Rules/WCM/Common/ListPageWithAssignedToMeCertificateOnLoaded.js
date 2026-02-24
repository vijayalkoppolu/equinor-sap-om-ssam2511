import CommonLibrary from '../../Common/Library/CommonLibrary';
import FilterSettings from '../../Filter/FilterSettings';
import AssignedToLibrary from './AssignedToLibrary';


export default function ListPageWithAssignedToMeCertificateOnLoaded(context) {
    FilterSettings.saveInitialFilterForPage(context);
    FilterSettings.applySavedFilterOnList(context, { AssignedToQuery: (ctx) => AssignedToLibrary.IsAssignedToVisibleByAssignmentsCertificate(CommonLibrary.getWCMDocumentAssignmentTypes(ctx)) });
    context.getControl('SectionedTable').redraw(true);
}
