
export default function FLWithdrawnQty(clientAPI) {
     const binding = clientAPI.binding;
     return Number( Number(binding.EntryQty) === 0 ? clientAPI.binding.WithdrawnQty : binding.EntryQty );
}
