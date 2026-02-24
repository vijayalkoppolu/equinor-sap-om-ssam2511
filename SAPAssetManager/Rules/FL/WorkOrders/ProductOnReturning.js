import ListPageWithFilterOnLoaded from '../../Filter/ListPageWithFilterOnLoaded';
import { redrawFilter } from '../Common/FLLibrary';
import libCom from '../../Common/Library/CommonLibrary';
export default function ProductOnReturning(clientAPI) {
    clientAPI.getPageProxy().getControls()[0].getSections()[0].setSelectionMode('None');
    ListPageWithFilterOnLoaded(clientAPI);
    libCom.setStateVariable(clientAPI, 'BulkFLUpdateNav',false);
    const headerPage = clientAPI.evaluateTargetPath('#Page:FLWorkOrderDetailView');
    headerPage?.redraw();
    const productPage = clientAPI.evaluateTargetPath('#Page:FLProductsList');
    return redrawFilter('SectionedTable', 'SectionObjectTable',productPage.context?._clientAPI);

}
