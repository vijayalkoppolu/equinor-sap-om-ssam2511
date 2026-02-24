
export default function FormatDestinationStorageLocation(clientAPI) {    
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'StorageLocations', [], `$filter=StorageLocation eq '${clientAPI.binding.SupplyingStorageLocation}' and Plant eq '${clientAPI.binding.FieldLogisticsTransferPlant}'`, '')
        .then((response) => {  
            if (response && response.length > 0) {
                const storageLocation = response.getItem(0);
                
                return storageLocation.StorageLocationDesc;
            } else {
                return clientAPI.binding.SupplyingStorageLocation;
            }
           
        });
}
