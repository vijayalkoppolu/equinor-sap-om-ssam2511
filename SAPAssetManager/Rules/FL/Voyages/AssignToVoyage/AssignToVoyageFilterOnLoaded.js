import FilterOnLoaded from '../../../Filter/FilterOnLoaded';
/**
* @param {IClientAPI} clientAPI
*/
export default function AssignToVoyageFilterOnLoaded(context) {
    const fc = context.getControl('FormCellContainer');
    const clientData = context.evaluateTargetPath('#Page:AssignToVoyagePage/#ClientData');
    if (clientData.VoyageNumberInput) {
        fc.getControl('VoyageNumberInput').setValue(clientData.VoyageNumberInput);
    }
    if (clientData.FromShippingPointInput) {
        fc.getControl('FromShippingPointInput').setValue(clientData.FromShippingPointInput);
    }
    if (clientData.ToReceivingPointInput) {
        fc.getControl('ToReceivingPointInput').setValue(clientData.ToReceivingPointInput);
    }
    if (Array.isArray(clientData.VoyageTypeFilter) && clientData.VoyageTypeFilter.length > 0) {
        fc.getControl('VoyageTypeFilter').setValue([clientData.VoyageTypeFilter[0].ReturnValue]);
    }
    if (Array.isArray(clientData.DestinationPlantFilter) && clientData.DestinationPlantFilter.length > 0) {
        fc.getControl('DestinationPlantFilter').setValue([clientData.DestinationPlantFilter[0].ReturnValue]);
    }
    FilterOnLoaded(context);
}
