import FSMFormPageNavWrapper from '../../FSMFormPageNavWrapper';
import GetFSMFormInstanceId from '../Data/GetFSMFormInstanceId';

export default async function OnFormTemplatePreview(context) {
    const templateBinding = context.getPageProxy().getActionBinding();
    const previewId = await GetFSMFormInstanceId(context);

    const previewFormInstanceBinding = {
        'isForPreview': true,
        'Closed': true, // to make fields non-editable
        'Id': previewId,
        'Content': '',
        'Template': templateBinding.Id,
        'FSMFormTemplate_Nav': templateBinding,
    };

    return FSMFormPageNavWrapper(context.currentPage.context.clientAPI, previewFormInstanceBinding);
}
