import CommonLibrary from '../Common/Library/CommonLibrary';

// Constructs a query string to filter historical inspection results for a specific technical object (Equipment or Functional Location).
export default function InspectionCharacteristicHistoryQueryOptions(context) {
    let prevPageBinding = context.evaluateTargetPathForAPI('#Page:-Previous')?.binding;
    let queryString = 'orderby=LastChangedDate desc';

    if (prevPageBinding['@odata.type'] !== '#sap_mobile.InspectionCharacteristic') {
        CommonLibrary.setStateVariable(context, 'InspectionCharacteristicParentPage', prevPageBinding);
    }
    const parentObj = CommonLibrary.getStateVariable(context, 'InspectionCharacteristicParentPage');

    const currentBinding = context?.binding;
    if (parentObj?.['@odata.type'] === '#sap_mobile.InspectionLot') {
        const { FuncLocId, EquipNum } = currentBinding?.InspectionPoint_Nav || {};
        if (EquipNum) {
            return `$filter=EquipId eq '${EquipNum}'&${queryString}`;
        } else if (FuncLocId) {
            return `$filter=FuncLocIdIntern eq '${FuncLocId}'&${queryString}`;
        }
    } else if (parentObj?.['@odata.type'] === '#sap_mobile.EAMChecklistLink') {
        const { FunctionalLocation, Equipment } = parentObj;
        // When coming from the checklist page, Equipment has higher priority over FunctionalLocation even if both are present. 
        // This is because Equipment is the primary identifier in this context.
        if (Equipment) {
            return `$filter=EquipId eq '${Equipment}'&${queryString}`;
        } else if (FunctionalLocation) {
            return `$filter=FuncLocIdIntern eq '${FunctionalLocation}'&${queryString}`;
        }
    }
    return `$${queryString}`;
}
