import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default async function FLPackedPackagesListViewPageMetadata(clientAPI) {
    const page = clientAPI.getPageDefinition('/SAPAssetManager/Pages/FL/PackContainers/AssignToContPackageListView.page');
    return await ModifyListViewSearchCriteria(clientAPI, page); 
}


