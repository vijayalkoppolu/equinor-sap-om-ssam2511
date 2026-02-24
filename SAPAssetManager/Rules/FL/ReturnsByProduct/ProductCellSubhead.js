export default function ProductCellSubhead(context) {
    const number = context.binding.FldLogsReferenceDocumentNumber || '';
    const category = context.binding?.FldLogsRefDocType_Nav?.ReferenceDocumentCategoryName || '';
    if (number && category) {
        return `${number} / ${category}`;
    }
    return number || category;
}
