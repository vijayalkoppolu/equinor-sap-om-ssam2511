import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function HUDelItemsOnSelectionModeChanged(context) {
    CommonLibrary.setStateVariable(context, 'HUDelDiscardDocuments', []);
    CommonLibrary.setStateVariable(context, 'HUDelNotFoundDocuments', []);
    return Promise.resolve(true);
}
