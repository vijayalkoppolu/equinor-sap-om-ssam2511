export default function EDTIsManageSerialsVisible(context) {
    const binding = context.binding;
    return binding && binding.Serialized === 'X';
}
