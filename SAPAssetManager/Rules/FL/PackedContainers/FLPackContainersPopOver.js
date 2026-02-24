import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FLPackContainersPopOver(context, binding = context.binding) {
    return CommonLibrary.navigateOnRead(context.getPageProxy(), '/SAPAssetManager/Actions/FL/PackContainers/FLPackContainersPopOver.action', binding['@odata.readLink'], '');
}
