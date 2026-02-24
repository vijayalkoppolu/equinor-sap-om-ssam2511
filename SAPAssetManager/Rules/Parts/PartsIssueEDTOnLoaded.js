
import libCom from '../Common/Library/CommonLibrary';

export default function PartsIssueEDTOnLoaded(context) {
    const outPartsList = libCom.getStateVariable(context, 'OutPartsList') || [];
    const inPartsList = libCom.getStateVariable(context, 'InPartsList') || [];

    if (inPartsList.length === 0 || outPartsList.length > 0) {
        if (inPartsList.length === 0) {
            context.getPageProxy().setActionBarItemVisible('SaveButton', false);
        }
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/ErrorBannerMessage.action',
            'Properties': {
                'Message': context.localizeText('ignored_parts'),
                'Duration': 9999,
            },
        });
    }

    return Promise.resolve();
}
