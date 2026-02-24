import libCom from '../../../Common/Library/CommonLibrary';
/**
 * Returns true if the next button should be visible
 */
export default function IsNextButtonVisible(context) {
    return !!(libCom.getStateVariable(context,'WHNextItem'));
}
