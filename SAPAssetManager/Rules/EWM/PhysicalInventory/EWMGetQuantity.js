export default function EWMGetQuantity(context) {
    if (context.binding?.Quantity) {
        return context.binding.ZeroCount === 'X' ? [context.binding.Quantity, context.localizeText('pi_zero_count')].join(' - ') : context.binding.Quantity;
    } else {
        return '-';
    }
}
