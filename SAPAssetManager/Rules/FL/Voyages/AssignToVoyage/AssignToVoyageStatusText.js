export default async function AssignToVoyageStatusText(context) {
    const binding = context.binding;
    let voyageTypeDescription = '';
    if (binding.VoyageTypeCode) {
        const typeResults = await context.read(
            '/SAPAssetManager/Services/AssetManager.service',
            'FldLogsVoyageTypeCodes',
            [],
            `$filter=VoyageTypeCode eq '${binding.VoyageTypeCode}'`,
        );
        if (typeResults && typeResults.length > 0) {
            voyageTypeDescription = typeResults.getItem(0).Description;
        }
    }
    return [voyageTypeDescription, binding.SourceStage, binding.Supplier].filter((item) => !!item).join(', ');
}
