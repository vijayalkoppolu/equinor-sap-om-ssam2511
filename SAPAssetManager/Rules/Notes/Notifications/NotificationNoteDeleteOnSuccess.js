import Logger from '../../Log/Logger';
import DeleteEntitySuccessMessageWithAutoSave from '../../ApplicationEvents/AutoSync/actions/DeleteEntitySuccessMessageWithAutoSave';


export default async function NotificationNoteDeleteOnSuccess(context) {
    try {
        const notificationNumber = context.binding.NotificationNumber;

        await context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericDiscard.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'NotificationHistoryTexts',
                    'EditLink': `NotificationHistoryTexts('${notificationNumber}')`,
                },
            },
        });
    } catch (error) {
        Logger.error('NotificationHistoryTexts deletion error', error);
    }

    return DeleteEntitySuccessMessageWithAutoSave(context);
}
