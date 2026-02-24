export default function EntryQuantity(context) {
return context.binding.EntryQty ? context.binding.EntryQty : context.binding.WithdrawnQty;
}
