import libCom from '../../Common/Library/CommonLibrary';
export default function UpdatedMessage(clientAPI) {
    const actionProperties = {
        'Name': '/SAPAssetManager/Actions/FL/Edit/UpdatedMessage.action',
        'Properties': {
            'Message': (libCom.getStateVariable(clientAPI, 'Receive') ? clientAPI.localizeText('receive_successful') : clientAPI.localizeText('update_successful')),
        },
    };
    return clientAPI.executeAction(actionProperties);
}
