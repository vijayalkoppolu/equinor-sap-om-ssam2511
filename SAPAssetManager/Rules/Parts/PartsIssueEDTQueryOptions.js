import libCom from '../Common/Library/CommonLibrary';

export default function PartsIssueEDTQueryOptions(context) {
    const inPartsList = libCom.getStateVariable(context, 'InPartsList') || [];
    if (inPartsList.length === 0) {
        return '$filter=false';
    }

    const ignoredItemNumberList = libCom.getStateVariable(context, 'IgnoredItemNumberList') || [];
    const filterPartsList = inPartsList.map(part => `MaterialNum eq '${part}'`);
    const filterBase = [];

    if (context.binding.OrderId) {
        filterBase.push(`OrderId eq '${context.binding.OrderId}'`);
    }

    if (context.binding.OperationNo) {
        filterBase.push(`OperationNo eq '${context.binding.OperationNo}'`);
    }

    ignoredItemNumberList.forEach(itemNumber => {
        filterBase.push(`ItemNumber ne '${itemNumber}'`);
    });

    return `$filter=(${filterBase.join(' and ')} and (${filterPartsList.join(' or ')}))&$expand=Material,MaterialBatch_Nav`;
}
