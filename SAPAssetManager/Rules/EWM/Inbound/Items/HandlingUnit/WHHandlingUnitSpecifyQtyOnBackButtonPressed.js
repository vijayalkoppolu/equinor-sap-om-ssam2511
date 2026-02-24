export default function WHHandlingUnitSpecifyQtyOnBackButtonPressed(context) {
    const eventData = context.getAppEventData();
    const isActivityBackPressedEvent = eventData && eventData.eventName === 'activityBackPressed';

    const edtControl = context.getControls()[0].getSections()[0].getExtension();

    const values = edtControl.getAllValues();
    const hasChanges = values.some(row => row.Properties.qty !== row.OdataBinding.qty || row.Properties.number !== row.OdataBinding.number);

    if (hasChanges) {
        if (isActivityBackPressedEvent) {
            eventData.cancel = true;
        }

        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Page/ConfirmCancelPage.action',
            'Properties': {
                'OnOK': '',
            },
        }).then((result) => {
            if (isActivityBackPressedEvent && result.data) {
                return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
            }

            return result.data;
        });
    }
    return Promise.resolve(true);
}
