import OverviewTabPageUpdate from '../Common/TabPage/OverviewTabPageUpdate';

export default function FunctionalLocationTabPageMetadata(clientAPI) {
    let page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FunctionalLocation/FunctionalLocationListView.page');
    return OverviewTabPageUpdate(clientAPI, page, '/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationFilter.action', 'MyFunctionalLocation', '/SAPAssetManager/Rules/FunctionalLocation/FunctionalLocationCaption.js');
}
