
import libcom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
export default function FLPInitiateReturn(context) {
    libcom.setStateVariable(context, 'ReturnableQty', context.binding.RetblQtyInBaseUnit);
    let formCellSection = context.getPageProxy().getControl('FormCellContainer').getSection('FormCellSection1');

    if (libcom.getStateVariable(context, 'BulkFLUpdateNav')) {
        const entryQty = Number(formCellSection.getControl('ReturnableQuantity').getValue());
        const recommAction = libcom.getListPickerValue(formCellSection.getControl('RecommActionLstPkr').getValue());
        const supplyStoreLoc = libcom.getListPickerValue(formCellSection.getControl('DestStoreLocLstPkr').getValue());
        const fldTransferPlant = libcom.getListPickerValue(formCellSection.getControl('DestPlantLstPkr').getValue());
        const comment = context.getPageProxy().getControl('FormCellContainer').getSection('FormCellSection2').getControl('Comments').getValue();
        const retbleOrderUnit = libcom.getListPickerValue(formCellSection.getControl('ReturnableQuantityUOMLstPkr').getValue());

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPInitiateReturnUpdate.action',
            'Properties': {
                'Target': {
                    'ReadLink': context.binding['@odata.readLink'],
                },
                'Properties': {
                    'EntryQty': entryQty,
                    'FldLogsRecommendedAction': recommAction,
                    'SupplyingStorageLocation': supplyStoreLoc,
                    'FieldLogisticsTransferPlant': fldTransferPlant,
                    'FldLogsReturnComment': comment,
                    'RetblQtyOrderUnit': retbleOrderUnit,

                },
                'OnSuccess': '',
                'ValidationRule': '/SAPAssetManager/Rules/FL/ReturnsByProduct/ValidateInitiateReturn.js',
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
        return context.executeAction('/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPInitiateReturnUpdate.action');
    }

}
