
export default function WOPriorityStatusStyle(context) {

    let binding = context.getBindingObject();
    let entityType = binding['@odata.type'];

    if (entityType === '#sap_mobile.MyWorkOrderHeader') {
        if (binding && binding.WOPriority && (binding.WOPriority.Priority || binding.WOPriority.PriorityDescription)) {
            return GetPriorityColor(binding.WOPriority.Priority || binding.WOPriority.PriorityDescription);
        }
    
        if (binding && binding.Priority) {
            return GetPriorityColor(binding.Priority);
        }
    } else if (entityType === '#sap_mobile.MyWorkOrderOperation') {
        return GetPriorityColor(context.binding.WOHeader?.WOPriority.Priority);
    } else if (entityType === '#sap_mobile.MyWorkOrderSubOperation') {
        return GetPriorityColor(context.binding.WorkOrderOperation.WOHeader?.WOPriority.Priority);
    }
    return 'GrayText';
}

export const PriorityEnum = Object.freeze({
    veryHighPriority: '1',
    highPriority: '2',
    mediumPriority: '3',
    emergencyPriority: '*',
});

export function GetPriorityColor(priority) {
    return {
        [PriorityEnum.emergencyPriority]: 'HighPriorityRed',
        [PriorityEnum.veryHighPriority]: 'HighPriorityRed',
        [PriorityEnum.highPriority]: 'HighPriorityRed',
        [PriorityEnum.mediumPriority]: 'MediumPriorityOrange',
    }[priority] || 'GrayText';
}
