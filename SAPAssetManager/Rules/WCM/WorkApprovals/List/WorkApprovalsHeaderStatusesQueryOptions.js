import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function WorkApprovalsHeaderStatusesQueryOptions(context) {
    // by default all statuses from quick filters
    const actualSystemStatuses = [
        context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Created.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/Prepared.global').getValue(),
        context.getGlobalDefinition('/SAPAssetManager/Globals/SystemStatuses/WorkPermitPrinted.global').getValue(),
    ];

    const filterTerm = actualSystemStatuses.map(status => `ActualSystemStatus ne '${status}'`).join(' and ');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMApprovals', ['ActualSystemStatus'], `$filter=${filterTerm}`)
        .then((/** @type {ObservableArray<WCMApproval>} */ approvals) => ValidationLibrary.evalIsEmpty(approvals) ? [] : Array.from(approvals, a => a.ActualSystemStatus))
        .then(systemStatuses => [... new Set([...actualSystemStatuses, ...systemStatuses])])
        .then(result => {
            const systemStatusFilterTerm = result.map(status => `SystemStatus eq '${status}'`).join(' or ');
            return `$filter=(${systemStatusFilterTerm})&$select=StatusText,SystemStatus`;
        });
}
