import libCom from '../../../Common/Library/CommonLibrary';
/**
 * Returns true if the previous button should be visible
 */
export default function IsPreviousButtonVisible(context) {
    return !!(libCom.getStateVariable(context,'WHPreviousItem'));
}
