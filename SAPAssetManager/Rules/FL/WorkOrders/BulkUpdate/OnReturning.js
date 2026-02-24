import libCom from '../../../Common/Library/CommonLibrary';
export default function onReturning(clientAPI) {
    libCom.setStateVariable(clientAPI, 'BulkFLUpdateNav', false);
    return clientAPI.getControl('SectionedTable').redraw();
}
