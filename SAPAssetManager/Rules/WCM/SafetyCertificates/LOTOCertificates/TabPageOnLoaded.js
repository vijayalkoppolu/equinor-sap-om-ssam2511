import CommonLibrary from '../../../Common/Library/CommonLibrary';
import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterSettings from '../../../Filter/FilterSettings';
import AssignedToLibrary from '../../Common/AssignedToLibrary';

/** @param {IPageProxy} context currently selected tab's pageproxy */
export default function TabPageOnLoaded(context) {
    FilterSettings.applySavedFilterOnList(context, { AssignedToQuery: (ctx) => AssignedToLibrary.IsAssignedToVisibleByAssignmentsCertificate(CommonLibrary.getWCMDocumentAssignmentTypes(ctx)) });
    const LOTOCertificatesListPage = context.evaluateTargetPath('#Page:LOTOCertificatesListViewPage');
    const sectionedTable = context.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');
    if (sectionedTable === undefined) {  // first page onload: the sectionedtable may not be instantiated
        return;
    }
    FilterLibrary.setFilterActionItemText(context, LOTOCertificatesListPage, sectionedTable);
}
