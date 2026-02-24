import Logger from '../Log/Logger';
import DocumentCreateObjectKeyForHeader from './Create/DocumentCreateObjectKeyForHeader';
import DocumentEditorCreateInfo from './DocumentEditorCreateInfo';

export default async function DocumentEditorObjectKey(context, binding = context.binding) {
    try {
        const documentInfo = await DocumentEditorCreateInfo(context);
        if (documentInfo) {
            const parentEntity = await context.read('/SAPAssetManager/Services/AssetManager.service', documentInfo.parentReadLink, [], '').then(result => result.getItem(0));
            const objectKey = DocumentCreateObjectKeyForHeader(context, parentEntity);
            return objectKey;
        }
    } catch (error) {
        Logger.error('DocumentEditorObjectKey', error);
    }
    return binding.ObjectKey;
}
