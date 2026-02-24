import libcom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
export default function FLPUpdatePickQuantity(context) {
    libcom.setStateVariable(context, 'ReturnableQty', context.binding.RetblQtyInBaseUnit);
    let formCellSection = context.getPageProxy().getControl('FormCellContainer').getSection('FormCellSection1');

    if (libcom.getStateVariable(context, 'BulkFLUpdateNav')) {


        const entryQty = Number(formCellSection.getControl('LoadingQuantity').getValue()); 
        const comment = context.getPageProxy().getControl('FormCellContainer').getSection('FormCellSection2').getControl('Comments').getValue();
        const recvgPoint = libcom.getListPickerValue(formCellSection.getControl('ReceivingPointListPkr').getValue());

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPUpdatePickQuantity.action',
            'Properties': {
                'Target': {
                    'ReadLink': context.binding['@odata.readLink'],
                },
                'Properties': {
                    'LoadingQtyInOrderUnit': entryQty,
                    'FldLogsReturnComment': comment,
                    'FldLogsVoyageDestStage': recvgPoint,

                },
                'OnSuccess': '',
            },
        }).then(() => {
            const actionProperties = {
                'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action',
                'Properties': {
                    'Message': context.localizeText('update_successful'),
                    'OnSuccess': '/SAPAssetManager/Rules/FL/BulkUpdate/BulkUpdateClosePage.js',
                },
            };
            return context.executeAction(actionProperties).catch(error => {
                Logger.error('FLUpdate', error);
            });
        });
    } else {
        return context.executeAction('/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPUpdatePickQuantity.action');
    }

}
