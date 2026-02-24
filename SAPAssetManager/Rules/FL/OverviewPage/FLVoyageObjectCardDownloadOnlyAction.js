import CommonLibrary from '../../Common/Library/CommonLibrary';
import FLVoyageDownload from './FLVoyageDownload';

export default function FLVoyageObjectCardDownloadOnlyAction(context) {
    CommonLibrary.setStateVariable(context, 'DocumentObjectId', context.getPageProxy().getActionBinding().VoyageStageUUID);
    FLVoyageDownload(context);
}
