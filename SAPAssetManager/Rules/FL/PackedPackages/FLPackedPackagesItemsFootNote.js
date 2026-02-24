export default function FLPackedPackagesItemsFootNote(context) {
    const sourcePlant = context.binding.FldLogsSrcePlnt;
    const packagingMaterial = context.binding.PackagingMaterial;
    if (sourcePlant && packagingMaterial) {
        return `${sourcePlant} , ${packagingMaterial}`;
    } else if (sourcePlant) {
        return sourcePlant;
    } else if (packagingMaterial) {
        return packagingMaterial;
    }
    return '';
}
