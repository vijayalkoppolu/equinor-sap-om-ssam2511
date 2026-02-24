import CommonLibrary from  '../../../Common/Library/CommonLibrary';
export default function OnReturning(clientAPI) {
    const section = clientAPI.getPageProxy().getControl('SectionedTable');
    section.redraw();
    CommonLibrary.clearStateVariable(clientAPI, 'FailedItems');
}
