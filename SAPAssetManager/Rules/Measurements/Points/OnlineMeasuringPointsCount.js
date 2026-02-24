import IsOnlinePRT from '../../Operations/PRT/IsOnlinePRT';

export default async function OnlineMeasuringPointsCount(clientAPI, binding = clientAPI.getPageProxy().binding) {
    if (IsOnlinePRT(clientAPI)) {
        const toolsLink = binding['@odata.readLink'] + '/Tools';
        const prt = await clientAPI.read('/SAPAssetManager/Services/OnlineAssetManager.service', toolsLink, [], "$filter=PRTCategory eq 'P'");
        let prtFilter = '$filter=' + prt.map(item => `Point eq '${item.Point}'`).join(' or ');
        return clientAPI.count('/SAPAssetManager/Services/OnlineAssetManager.service', 'MeasuringPoints', prtFilter);
    } else {
        const filter = binding.EquipId ? `$filter=EquipId eq '${binding.EquipId}'` : `$filter=FuncLocIdIntern eq '${binding.FuncLocIdIntern}'`;
        return clientAPI.count('/SAPAssetManager/Services/OnlineAssetManager.service', 'MeasuringPoints', filter);    
    }
}
