import CommonLibrary from '../Common/Library/CommonLibrary';

/**
* Executes message action with info that home screen layout is being used by default after intial sync/app update
* @param {IClientAPI} clientAPI
*/
export default function ShowHomeScreenInfoMessage(context) {
    //needs to wait until overview page made a redraw
    return CommonLibrary.sleep(2000).then(() => {
        context.dismissActivityIndicator();
        return context.executeAction('/SAPAssetManager/Actions/HomeScreenInfoMessage.action');
    });
}
