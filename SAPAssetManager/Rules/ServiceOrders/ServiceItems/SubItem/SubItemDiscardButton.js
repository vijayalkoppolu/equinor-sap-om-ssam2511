import ODataLibrary from '../../../OData/ODataLibrary';

export default function SubItemDiscardButton(context) {
    return {
        'Type': 'Button',
        'IsMandatory': false,
        'IsReadOnly': !ODataLibrary.isLocal(context.binding),
        'Property': '',
        'Parameters': {
            'Value': '$(L,discard)',
            'Action': '/SAPAssetManager/Rules/ServiceOrders/ServiceItems/SubItem/SubItemDiscardAction.js',
            'Style': 'Secondary',
        },
    };
}
