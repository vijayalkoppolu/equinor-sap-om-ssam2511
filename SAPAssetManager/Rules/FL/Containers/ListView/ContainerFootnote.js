/**
* @param {IClientAPI} context
*/
export default function ContainerFootnote(context) {
    const packageCount = context.binding.FldLogsPackage_Nav?.length || Number(context.binding.PackageCount || 0);
    const containerItemCount = context.binding.FldLogsContainerItem_Nav?.length || Number(context.binding.ContainerItemCount || 0);
    return [{label: packageCount === 1 ? 'x_package' : 'x_packages', val: packageCount}, 
            {label: containerItemCount === 1 ? 'x_item' : 'x_items', val: containerItemCount}]
            .filter((prop) => !!prop.val)
            .map((prop) => context.localizeText(prop.label, [prop.val]))
            .join(', ');
}
