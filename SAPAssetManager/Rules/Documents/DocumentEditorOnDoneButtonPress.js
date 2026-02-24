import {DocumentEditorSaveFile} from './DocumentEditorOnSave';
import DocumentAutoResizeImage from './DocumentAutoResizeImage';
import DocumentEditorIsAutoResizeEnabled from './DocumentEditorIsAutoResizeEnabled';
import Logger from '../Log/Logger';
import CommonLibrary from '../Common/Library/CommonLibrary';
import DocumentEditorIsImageFormatWrapper from './DocumentEditorIsImageFormatWrapper';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentEditorOnDoneButtonPress(context) {
    if (DocumentEditorIsAutoResizeEnabled(context) && DocumentEditorIsImageFormatWrapper(context)) {
        context.showActivityIndicator();
        return DocumentAutoResizeImage(context).then(()=>{
            DocumentEditorSaveFile(context);
            return CommonLibrary.sleep(500).then(()=>{
                // long running task
                context.dismissActivityIndicator();
                CommonLibrary.clearStateVariable(context, 'DocumentEdited');
                // done, so navigate back
                return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
            });
        });
    } else {
        Logger.debug('IMAGE_EDITOR', 'Auto-resize is not enabled');
        CommonLibrary.clearStateVariable(context, 'DocumentEdited');
        DocumentEditorSaveFile(context);
        return context.executeAction('/SAPAssetManager/Actions/Page/PreviousPage.action');
    }
}
