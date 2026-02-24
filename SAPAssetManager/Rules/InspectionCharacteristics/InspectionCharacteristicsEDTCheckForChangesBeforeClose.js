
/**
* Check for unsaved changes before closing or canceling a page
* @param {IClientAPI} context
*/
export default function InspectionCharacteristicsEDTCheckForChangesBeforeClose(context) {
    const confirmCloseAction = '/SAPAssetManager/Actions/Page/ConfirmClosePage.action';
    const sections = context.getPageProxy().getControls()[0].getSections();

    for (let section of sections) {
        if (section.getExtension) {
            const extension = section.getExtension();
            if (extension && extension.constructor && extension.constructor.name === 'EditableDataTableViewExtension') {
                const values = extension.getUpdatedValues();
                if (values && values.length > 0) {
                    return context.executeAction(confirmCloseAction);
                }
            }
        }
    }

    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
