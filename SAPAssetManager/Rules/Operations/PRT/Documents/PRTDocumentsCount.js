import CommonLibrary from '../../../Common/Library/CommonLibrary';
import IsOnlinePRT from '../IsOnlinePRT';

export default function PRTDocumentsCount(context) {
    const service = IsOnlinePRT(context) ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
    return CommonLibrary.getEntitySetCount(context,context.getPageProxy().binding['@odata.readLink']+'/Tools', "$filter=PRTCategory eq 'D'", service);    
}
