import UpdateRequiredFailed from '../../../../Common/UpdateRequiredFailed';
import libCommon from '../../../../Common/Library/CommonLibrary';
import IsAndroid from '../../../../Common/IsAndroid';

export default function WHHandlingUnitCreateRequiredFieldsOnFailed(context) {
    if (libCommon.getPageName(context) === 'WHHandlingUnitMixedCreatePage') {
        // Clear validation on all controls in the first form cell section only, 
        // since redraw of FormCellContainer, as implemented in UpdateRequiredFailed, 
        // results in the loss of entered data in EDT

        const formCellContainer = context.getControl('FormCellContainer');
        const section = formCellContainer.getSection('FormCellSection1');

            const allControls = section.getControls();
            for (const item of allControls) {
                item.clearValidationOnValueChange();
            }
            section.redraw();
        
            const missingRequiredFields = context.getMissingRequiredControls();
            const message = context.localizeText('field_is_required');
        

            const promises = [];
            for (const control of missingRequiredFields) {
                promises.push(libCommon.executeInlineControlError(context, control, message));
            }
        
            return Promise.all(promises).finally(() => {
                if (IsAndroid(context)) {
                    section.redraw();
                }
            });
    }

    return UpdateRequiredFailed(context);
}
