import libCom from '../Common/Library/CommonLibrary';
import libConfirm from './ConfirmationScenariosLibrary';

/**
 * Handle max length validation for the long text comment field
 * @param {*} context 
 */
export default function GenerateQRCodeCommentOnChange(context) {

    if (!libCom.getStateVariable(context, 'QRCodeExpiredDisplayed')) { //User has started typing, so invalidate the current QR-Code and display the expired image
        libConfirm.displayExpiredQRCodeControl(context);
    }

    const noteValue = context.getValue();
    let charLimit = libCom.getStateVariable(context, 'CooperationMaxTextLength');

    if (noteValue && charLimit > 0 && noteValue.length > charLimit) { //Zero means no limit
        let note = noteValue.substring(0, charLimit);
        context.setValue(note);
    }
}
