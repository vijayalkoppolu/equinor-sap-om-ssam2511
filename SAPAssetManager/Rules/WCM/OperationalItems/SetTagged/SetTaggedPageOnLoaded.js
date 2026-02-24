import CommonLibrary from '../../../Common/Library/CommonLibrary';
import SetUpAttachmentTypes from '../../../Documents/SetUpAttachmentTypes';

export default function SetTaggedPageOnLoaded(context) {
    SetUpAttachmentTypes(context);

    CommonLibrary.saveInitialValues(context);
}
