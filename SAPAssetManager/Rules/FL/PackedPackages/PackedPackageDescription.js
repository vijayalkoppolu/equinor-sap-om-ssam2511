export default function PackedPackageDescription(context) {
    const binding = context.binding;
    const parts = [];

    if (binding.FldLogsSrcePlnt) {
        parts.push(`${context.localizeText('fld_source_plant')}: ${binding.FldLogsSrcePlnt}`);
    }
    if (binding.FldLogsDestPlnt) {
        parts.push(`${context.localizeText('fld_destination_plant')}: ${binding.FldLogsDestPlnt}`);
    }
    return parts.join('\n');
}
