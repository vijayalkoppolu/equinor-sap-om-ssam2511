import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsOnlinePRT from './IsOnlinePRT';

export default function PRTEquipmentsListViewCaption(context) {    
    const queryString = '$filter=(PRTCategory eq \'E\')';
    const service = IsOnlinePRT(context) ? '/SAPAssetManager/Services/OnlineAssetManager.service' : '/SAPAssetManager/Services/AssetManager.service';
    return CommonLibrary.getEntitySetCount(context,context.binding['@odata.readLink']+'/Tools', queryString, service).then(count => {
        return context.localizeText('equipment_x', [context.formatNumber(count)]);
    });
}
