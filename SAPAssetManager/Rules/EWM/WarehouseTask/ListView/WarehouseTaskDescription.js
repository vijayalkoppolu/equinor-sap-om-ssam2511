export default function WarehouseTaskDescriptions(clientAPI) {
    const binding = clientAPI.binding;
    const sourceBin = binding.WarehouseTask_Nav?.SourceBin || binding.SourceBin;
    const destinationBin = binding.DestinationBin;

    const lines = [];

    if (sourceBin) {
        lines.push(clientAPI.localizeText('ewm_src_bin_x', [sourceBin]));
    }

    if (destinationBin) {
        lines.push(clientAPI.localizeText('ewm_dest_bin_x', [destinationBin]));
    }

    return lines.join('\n');
}
