import NotificationCreateNoteCreate from '../SubOperation/NotificationCreateNoteCreate';
import NoteUpdateTextString from '../NoteUpdateTextString';
import Logger from '../../Log/Logger';

export default async function NotificationNoteUpdateOnSuccess(context) {
    try {
        const notificationNumber = context.binding.NotificationNumber;

        await context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action',
            'Properties': {
                'Target': {
                    'EntitySet': 'NotificationHistoryTexts',
                    'ReadLink': `NotificationHistoryTexts('${notificationNumber}')`,
                },
                'Properties': {
                    'TextString': NoteUpdateTextString(context),
                },
                'Headers': {
                    'OfflineOData.TransactionID': notificationNumber,
                },
            },
        });
    } catch (error) {
        Logger.error('NotificationHistoryTexts updating error', error);
    }

    return NotificationCreateNoteCreate(context);
}
