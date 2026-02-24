import libCommon from '../../Common/Library/CommonLibrary';
import PRTpage from './PRTpage';

/**
* Returns if Add Note action is enabled for a specific measuring point
* @param {IClientAPI} context
*/
export default function PRTIsAddNoteVisible(context) {
    return PRTpage(context) && libCommon.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Edit') === 'Y';
}
