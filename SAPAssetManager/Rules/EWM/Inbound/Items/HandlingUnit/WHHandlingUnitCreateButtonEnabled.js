export default function WHHandlingUnitCreateButtonEnabled(context) {
    const binding = context.getActionBinding?.() || context.binding;

    return binding?.OpenPackableQuantity > 0;
}
