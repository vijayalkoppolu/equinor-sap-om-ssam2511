
export default function FormatResvItemsDescription(context) {
if (context.binding.StorageBin && context.binding.RemoteStorageLocation ) {
    return `${context.binding.StorageBin} - ${context.binding.RemoteStorageLocation}`;

} else if (context.binding.RemoteStorageLocation !== '') {
    return `${context.binding.RemoteStorageLocation}`;
} else if (context.binding.StorageBin !== '') {
    return `${context.binding.StorageBin}`;
} else return '';
}
