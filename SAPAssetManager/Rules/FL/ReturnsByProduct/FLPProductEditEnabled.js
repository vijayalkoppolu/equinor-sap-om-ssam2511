
import { ProductReturnStatus } from '../Common/FLLibrary';

export default function FLPProductEditEnabled(clientAPI) {

    const statusAtRemote = ProductReturnStatus.AtRemote;
    const statusReturnDraft = ProductReturnStatus.ReturnDraft;
    const statusReturnRequested = ProductReturnStatus.ReturnRequested;
    const statusReturnScheduled = ProductReturnStatus.ReturnScheduled;

    if (clientAPI.binding.FldLogsReturnStatus === statusAtRemote ||
        clientAPI.binding.FldLogsReturnStatus === statusReturnDraft ||
        clientAPI.binding.FldLogsReturnStatus === statusReturnRequested ||
        clientAPI.binding.FldLogsReturnStatus === statusReturnScheduled ) {
        return true;
    } else
        return false;
}
