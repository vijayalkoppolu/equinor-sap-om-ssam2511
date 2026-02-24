
export default function AddSmartFormOnCommit(context) {
    const binding = context.getPageProxy().binding;
    
    switch (binding['@odata.type']) {
        case '#sap_mobile.S4ServiceOrder': {
            return context.executeAction('/SAPAssetManager/Actions/Forms/CreateFSMS4FormInstance.action');
        }
        case '#sap_mobile.S4ServiceItem': {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Forms/CreateFSMS4FormInstance.action',
                'Properties': {
                    'Properties': {
                        'S4ServiceItemNumber': '{ItemNo}',
                    },
                },
            });
        }
        case '#sap_mobile.MyWorkOrderHeader': {
            return context.executeAction('/SAPAssetManager/Actions/Forms/CreateFSMCSFormInstance.action');
        }
        case '#sap_mobile.MyWorkOrderOperation': {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Forms/CreateFSMCSFormInstance.action',
                'Properties': {
                    'Properties': {
                        'Operation': '{OperationNo}',
                    },
                },
            });
        }
    }

    return Promise.resolve();
}
