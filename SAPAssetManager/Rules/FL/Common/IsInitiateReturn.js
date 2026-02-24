import { ProductReturnStatus } from './FLLibrary';
export default function IsInitiateReturn(status) {
    const statusAtRemote = ProductReturnStatus.AtRemote;
    const statusReturnDraft = ProductReturnStatus.ReturnDraft;
    const statusReturnRequested = ProductReturnStatus.ReturnRequested;

    if (status === statusAtRemote ||
        status === statusReturnDraft ||
        status === statusReturnRequested) {
        return true;
    } else
        return false;
}
