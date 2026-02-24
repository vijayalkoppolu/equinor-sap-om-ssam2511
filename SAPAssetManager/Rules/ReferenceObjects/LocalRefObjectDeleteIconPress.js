import CommonLibrary from '../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

/**
* Deleting local ref object connections (non-main)
* This would work only in S4 integration
* @param {IClientAPI} clientAPI
*/
export default async function LocalRefObjectDeleteIconPress(context) {
    const binding = context.getPageProxy().getActionBinding();
    if (CommonLibrary.isEntityLocal(binding) && binding.MainObject !== 'X' && IsS4ServiceIntegrationEnabled(context)) {
        const result = await context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action', 'Properties': {
                'Title': context.localizeText('confirm'),
                'Message': context.localizeText('confirm_delete'),
                'OKCaption': context.localizeText('ok'),
                'CancelCaption': context.localizeText('cancel'),
            },
        });
        if (result.data === true) {
            const pageBinding = context.getPageProxy().binding;
            let entitySetName;
            
            switch (pageBinding['@odata.type']) { 
                case '#sap_mobile.S4ServiceQuotation': {
                    entitySetName = 'S4ServiceQuotationRefObjs';
                    break;
                }
                case '#sap_mobile.S4ServiceRequest': {
                    entitySetName = 'S4ServiceRequestRefObjs';
                    break;
                }
                default: 
                    entitySetName = 'S4ServiceOrderRefObjs';
            }

            return await context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action', 'Properties': {
                    'Target': {
                        'EntitySet': entitySetName,
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': binding['@odata.readLink'],
                    },
                },
            });
        }
    }
    return Promise.resolve();
}
