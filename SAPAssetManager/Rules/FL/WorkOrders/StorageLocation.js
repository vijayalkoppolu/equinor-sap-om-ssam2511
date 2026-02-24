import libCom from '../../Common/Library/CommonLibrary';

export default function StorageLocation(clientAPI) {
    const page = clientAPI.getPageProxy();
    const storageLoc = libCom.getListPickerValue(libCom.getControlProxy(page, 'StorageLocLstPkr').getValue());
    return storageLoc ? storageLoc : clientAPI.binding.RemoteStorageLocation;
}
