import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
export default function AssignToContainerAction(context) {

    const items = libCom.getStateVariable(context, 'SelectedPackedPackages');
    const section = context.getPageProxy().getControls()[0].getSections()[0];
    const containerID = section.getSelectedItems()[0].binding.FldLogsContainerID || '';
    libCom.setStateVariable(context, 'AssignedContainerID', containerID);
    return AssignPackPackage(context, items).then(() => {
        const actionProperties = {
            'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action',
            'Properties': {
                'Message': context.localizeText('update_successful'),
            },
        };
        return context.executeAction(actionProperties).catch(error => {
            Logger.error('AssignToContainer', error);
        });
    });
}
export function AssignPackPackage(context, items) {
    return items.reduce((prevUpdatePromise, item) => {
        return prevUpdatePromise.then(() => {
            return updatePickQty(context, item);
        });
    }, Promise.resolve());
}
function updatePickQty(context, item) {
    let cntID = libCom.getStateVariable(context, 'AssignedContainerID');
    if ( libCom.getPageName(context) === 'AssignToContainerListViewPage') {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/FL/PackedPackages/FLPackedPackageAssignContainer.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'FldLogsPackCtnPkdPkgs',
                    'ReadLink': item['@odata.readLink'],
                },
                'Properties': {
                    'ActionType': 'ASGNCTN',
                    'ObjectId': item.ObjectId,
                    'AssignContainerId': cntID,
                },
                'Headers': {
                    'OfflineOData.TransactionID': `${item.ObjectId}`,
                },
                'ActionResult': {
                    '_Name': 'result',
                },
                'RequestOptions': {
                    'UpdateMode': 'Replace',
                    'UnmodifiableRequest': true,
                },
                'ValidationRule': '',
                'OnSuccess': '',
            },
        });
    } else {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/FL/ReadyToPack/FLReadyToPackAssignContainerPKG.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'FldLogsPackCtnRdyPcks',
                    'ReadLink': item['@odata.readLink'],
                },
                'Properties': {
                    'ActionType': 'ASGNCTNPKG',
                    'ObjectId': item.ObjectId,
                    'AssignContainerId': cntID,
                },
                'Headers': {
                    'OfflineOData.TransactionID': `${item.ObjectId}`,
                },
                'ActionResult': {
                    '_Name': 'result',
                },
                'RequestOptions': {
                    'UpdateMode': 'Replace',
                    'UnmodifiableRequest': true,
                },
                'ValidationRule': '',
                'OnSuccess': '',
            },
        });
    }

}


