import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function CreateUpdateServiceConfirmationItemCaption(context) {
    if (CommonLibrary.IsOnCreate(context)) {
        return context.localizeText('confirm_item');
    }

    return context.localizeText('edit_confirmation_item');
}
