import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
export default function IsResourceClaimed(context) {
    const resource = libCom.getStateVariable(context, 'EWMResource');
    return !ValidationLibrary.evalIsEmpty(resource);
}
