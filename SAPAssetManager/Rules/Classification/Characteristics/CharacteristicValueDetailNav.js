import QueryBuilder from '../../Common/Query/QueryBuilder';
import Logger from '../../Log/Logger';

export default function CharacteristicValueDetailNav(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.binding || {};
    const entityType = binding['@odata.type'];
    
    let entitySet = '';
    const queryOptions = new QueryBuilder();
    queryOptions.addAllExpandStatements(['Characteristic/ClassCharacteristics/Characteristic/CharacteristicValues','CharValCode_Nav']);
    queryOptions.addExtra('orderby=CharId');
    queryOptions.addFilter(`ObjectKey eq '${binding.ObjectKey}'`);
    queryOptions.addFilter(`CharId eq '${pageProxy.getActionBinding().Characteristic?.CharId}'`);

    if (entityType === '#sap_mobile.MyEquipClass') {
        entitySet = 'MyEquipClassCharValues';
    } else if (entityType === '#sap_mobile.MyFuncLocClass') {
        entitySet = 'MyFuncLocClassCharValues';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions.build()).then(results => {
        if (results.getItem(0)) {
            let actionBinding = results.getItem(0);
            actionBinding.InternClassNum = context.binding.InternClassNum;
            context.getPageProxy().setActionBinding(actionBinding);
        }
        return context.executeAction('/SAPAssetManager/Actions/Classification/Characteristics/CharacteristicValueDetailNav.action');
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryClassifications.global').getValue() , error);
    });
}
