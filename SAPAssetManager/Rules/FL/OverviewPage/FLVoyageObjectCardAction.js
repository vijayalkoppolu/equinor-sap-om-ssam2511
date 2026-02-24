import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function FLVoyageObjectCardAction(context) {
    CommonLibrary.setStateVariable(context, 'DocumentObjectId', context.getPageProxy().getActionBinding().VoyageStageUUID);
    CommonLibrary.setStateVariable(context, 'VoyageStatusUpdate', true);
    return context.executeAction('/SAPAssetManager/Actions/FL/Voyages/VoyageArrived.action');
}
