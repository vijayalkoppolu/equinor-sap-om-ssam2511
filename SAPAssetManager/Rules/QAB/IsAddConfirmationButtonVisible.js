import ConfirmationCreateIsEnabled from '../Confirmations/CreateUpdate/ConfirmationCreateIsEnabled';

export default function IsAddConfirmationButtonVisible(context) {
    return ConfirmationCreateIsEnabled(context);
}
