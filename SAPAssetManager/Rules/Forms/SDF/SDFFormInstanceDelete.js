export default async function SDFFormInstanceDelete(context) {
    const pageProxy = context.getPageProxy();
    let binding = pageProxy.getExecutedContextMenuItem().getBinding();

	const deleteMessageResult = await pageProxy.executeAction({
        'Name' : '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
        'Properties': {
            'Title': context.localizeText('sdf_delete_form'),
            'Message': context.localizeText('sdf_delete_form_message'),
            'OKCaption': context.localizeText('delete'),
            'CancelCaption': context.localizeText('cancel'),
        },
    });
    if (deleteMessageResult.data) {
        return pageProxy.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'DynamicFormInstances',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': binding?.DynamicFormInstance_Nav['@odata.readLink'],
                },
            },
        }).then(() => {
            return pageProxy.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericDelete.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'DynamicFormLinkages',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': binding['@odata.readLink'],
                    },
                },
            });
        });

    }

    return Promise.resolve();
}
