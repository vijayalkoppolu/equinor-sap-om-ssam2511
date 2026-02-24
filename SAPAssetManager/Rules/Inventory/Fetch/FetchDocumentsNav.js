import libCommon from '../../Common/Library/CommonLibrary';

export default async function FetchDocumentsNav(context) {
    libCommon.removeStateVariable(context, 'Documents');
    
    return context.executeAction('/SAPAssetManager/Actions/Inventory/Fetch/FetchDocuments.action');
}
