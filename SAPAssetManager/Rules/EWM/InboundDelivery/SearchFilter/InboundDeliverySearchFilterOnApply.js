export default function InboundDeliverySearchFilterOnApply(context) {
    const fc = context.getPageProxy().getControl('FormCellContainer');
    const switchValue = fc.getControl('PlannedDeliveryDateSwitch').getValue();
    const startDate = fc.getControl('PlannedDeliveryDateFrom').getValue();
    const endDate = fc.getControl('PlannedDeliveryDateTo').getValue();

    if (switchValue && startDate > endDate) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
            'Properties': {
                'Message': context.localizeText('from_greater_to'),
            },
        });
    }

    return context.executeAction('/SAPAssetManager/Rules/Filter/ApplyFilterAndSave.js');
}
