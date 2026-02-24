export default async function FSMFormInstanceDelete(context) {
    const pageProxy = context.getPageProxy();
    let binding = pageProxy.getExecutedContextMenuItem().getBinding();

	const deleteMessageResult = await pageProxy.executeAction({
        'Name' : '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
        'Properties': {
            'Title': context.localizeText('delete_template'),
            'Message': context.localizeText('delete_template_message'),
            'OKCaption': context.localizeText('delete'),
            'CancelCaption': context.localizeText('cancel'),
        },
    });
    
    if (deleteMessageResult.data) {
        return pageProxy.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'FSMFormInstances',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': binding['@odata.readLink'],
                },
            },
        });
    }

    return Promise.resolve();
}
