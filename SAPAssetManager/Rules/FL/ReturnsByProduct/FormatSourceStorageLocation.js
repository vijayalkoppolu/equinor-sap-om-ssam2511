

export default function FormatSourceStorageLocation(clientAPI) {
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'StorageLocations', [], `$filter=StorageLocation eq '${clientAPI.binding.RemoteStorageLocation}' and Plant eq '${clientAPI.binding.FldLogsRemotePlant}'`, '')
        .then((response) => {
            if (response && response.length > 0) {
                const storageLocation = response.getItem(0);

                return storageLocation.StorageLocationDesc;
            } else {
                return clientAPI.binding.RemoteStorageLocation;
            }

        });
}
