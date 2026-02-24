import libMeter from '../Common/MeterLibrary';
import meterDetailsOnReturn from '../../WorkOrders/Meter/MeterDetailsOnReturn';

export default async function MeterReplaceInstallNav(context, customBinding, batchEquipmentNum, orderISULink) {
    const proceedWithMeterInstallation = await context.executeAction('/SAPAssetManager/Actions/Meters/ReplaceDialog.action').then(result => result.data === true);

    if (proceedWithMeterInstallation) {
        let binding = customBinding;
        binding.BatchEquipmentNum = batchEquipmentNum;
        binding.OrderISULink = orderISULink;
        context.currentPage.context.clientAPI.setActionBinding(binding);
        
        libMeter.setMeterTransactionType(context, 'REP_INST');
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
    }

    return meterDetailsOnReturn(context);
}
