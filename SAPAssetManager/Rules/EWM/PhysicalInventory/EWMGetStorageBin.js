export default function EWMGetStorageBin(context) {
    if (context.binding?.StorageBin) {
        return context.binding.EmptyBin === 'X' ? [context.binding.StorageBin, context.localizeText('empty')].join(' - ') : context.binding.StorageBin;
    } else {
        return '-';
    }
}
