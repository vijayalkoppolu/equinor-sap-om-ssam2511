import libCom from '../../../Common/Library/CommonLibrary';
/**
 *  Returns RemoveHU switch value as SAP flag
 * @returns 
 */
export default function SetRemoveHUProperty(context) {
    return libCom.SetFlag(context.evaluateTargetPath('#Control:WhRemoveHuSwitch/#value'));
}
