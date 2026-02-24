import CommonLibrary from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
export default function FLReadyToPackUpdateSuccess(context) {
const page = CommonLibrary.getPageName(context);

    const onSuccessAction = (page === 'EditReadyToPackItem') ? '/SAPAssetManager/Rules/FL/BulkUpdate/BulkUpdateClosePage.js' : '';

    const actionProperties = {
        'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action',
        'Properties': {
            'Message': context.localizeText('update_successful'),
            'OnSuccess': onSuccessAction,
        },
    };
    return context.executeAction(actionProperties).catch(error => {
            Logger.error('FLUpdate', error);
        });
}
