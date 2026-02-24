
export default function IsOnlinePRT(context, binding = context.getPageProxy().binding) {
    const type = binding?.['@odata.type'];
    return type === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/OnlineWorkOrderOperation.global').getValue();
}
