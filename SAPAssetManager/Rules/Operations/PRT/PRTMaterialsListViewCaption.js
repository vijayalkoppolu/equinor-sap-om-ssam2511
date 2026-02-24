import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsOnlinePRT from './IsOnlinePRT';

export default function PRTMaterialsListViewCaption(context) {    
    const queryString = '$filter=(PRTCategory eq \'M\')';
    const service = IsOnlinePRT(context) ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Tools', queryString, service).then(count => {
        return context.localizeText('materials_x',[count]);
    });
}
