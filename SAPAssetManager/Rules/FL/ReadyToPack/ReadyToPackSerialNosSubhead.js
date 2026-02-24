export default function ReadyToPackSerialNosSubhead(context) {
    let binding = context.binding;
    if (binding && binding.Batch) {
        return context.localizeText('fld_batch_colon', [binding.Batch]);
    }
    return '';
}
