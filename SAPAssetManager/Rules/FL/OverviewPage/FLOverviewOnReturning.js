import libCom from '../../Common/Library/CommonLibrary';
export default function FLOverviewOnReturning(clientAPI) {
    libCom.clearStateVariable(clientAPI, 'FailedItems');
}
