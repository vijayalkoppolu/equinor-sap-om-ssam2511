import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FLVoyageStatusUpdate(context) {
    CommonLibrary.removeStateVariable(context, 'VoyageStatusUpdate');
    return context.executeAction('/SAPAssetManager/Actions/FL/Voyages/VoyageUpdateStatus.action');
}
