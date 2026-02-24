import CommonLibrary from '../../../Common/Library/CommonLibrary';
import IsOnlinePRT from '../IsOnlinePRT';

export default function PRTDocumentListViewCaption(context) {    
    const queryString = '$filter=(PRTCategory eq \'D\')';
    const service = IsOnlinePRT(context) ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Tools', queryString, service).then(count => {
        return context.localizeText('documents_x',[count]);
    });
}
