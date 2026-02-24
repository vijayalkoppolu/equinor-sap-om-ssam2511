import libVal from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointCaption(pageClientAPI) {
    const measuringPointData = pageClientAPI.getClientData().MeasuringPointData;

    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.PRTPoint;
    }
    if (!Object.prototype.hasOwnProperty.call(binding,'Point')) {
        binding =  binding.MeasuringPoint;
    }

    if (binding.WorkOrderTool && measuringPointData[binding.Point].PRT) {
        let prt = binding.WorkOrderTool.find(tool => tool.OperationNo === measuringPointData[binding.Point].OperationNo && measuringPointData[binding.Point].OrderId.includes(tool.OrderId));
        if (prt) {
            return '$(L, prt)' + ' - ' + prt.ItemCounter + ' - ' + prt.Description;
        }
     }
    
    if (!libVal.evalIsEmpty(binding.EquipId)) {
        let label = '$(L, equipment)' + ' - ' + binding.EquipId;
        if (binding.Equipment && binding.Equipment.EquipDesc) {
            label += ' - ' + binding.Equipment.EquipDesc;
        }
        return  label;
    } else if (!libVal.evalIsEmpty(binding.FuncLocIdIntern)) {
        let label = '$(L, functional_location)';
        if (binding.FunctionalLocation) {
            if (binding.FunctionalLocation.FuncLocId) {
                label += ' - ' + binding.FunctionalLocation.FuncLocId;
            }
            if (binding.FunctionalLocation.FuncLocDesc) {
                label += ' - ' + binding.FunctionalLocation.FuncLocDesc;
            }
        }
        return label;
    }

    return '$(L,point)';
}
