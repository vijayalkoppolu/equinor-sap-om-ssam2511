import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import FSMFormPageNavWrapper from '../../FSMFormPageNavWrapper';

export default async function CreateFSMFormInstancesOnSuccess(context) {
    CommonLibrary.setStateVariable(context, 'ObjectCreatedName', 'FSMFormInstances');
    await context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
    
    const data = context.getActionResult('CreatedFSMFormInstance').data;
    const formTemplateLink = JSON.parse(data)['@odata.readLink'];
    const formTemplate = await context.read('/SAPAssetManager/Services/AssetManager.service', formTemplateLink, [], '$expand=FSMFormTemplate_Nav').then(result => result.length ? result.getItem(0) : null);

    return FSMFormPageNavWrapper(context.currentPage.context.clientAPI, formTemplate);
}
