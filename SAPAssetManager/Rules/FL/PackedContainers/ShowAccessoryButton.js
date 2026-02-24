import { PackedPackagesTransStatus } from '../Common/FLLibrary';

export default function ShowAccessoryButton(clientAPI) {
    if (clientAPI.binding.FldLogsCtnIntTranspStsCode === PackedPackagesTransStatus.Dispatched || (clientAPI.binding.FldLogsCtnIntTranspStsCode === PackedPackagesTransStatus.ReadyForDispatch && clientAPI.binding.FldLogsVoyageAssignmentStatus === '20')) {
        return null;
    }

    return 'sap-icon://overflow';
}
