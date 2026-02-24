export default function WHHandlingUnitSpecifyQtyChange(context) {
    const value = context?._control?.getValue();

    if (value && (value <= 0 || !Number.isInteger(+value))) {
        context?._control?.applyValidation(context.localizeText('validation_value_integer_greater_than_zero'));
    } else if (context.binding?.OpenPackableQuantity && value > context?.binding.OpenPackableQuantity) {
        context?._control?.applyValidation(context.localizeText('validation_value_less_or_equal_than_open_packable_quantity'));
    } else {
        context?._control?.clearValidation();
    }
}
