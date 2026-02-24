export default function PackageSubstatus(context) {
    return context.localizeText('package_items', [context.binding.FldLogsPackageItem_Nav?.length  || Number(context.binding.ContainerItemCount || 0)]);
}
