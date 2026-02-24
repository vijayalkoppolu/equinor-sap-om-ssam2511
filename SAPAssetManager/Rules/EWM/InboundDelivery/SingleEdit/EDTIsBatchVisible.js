export default function EDTIsBatchVisible(context) {
    const binding = context.binding;
    return binding && binding.BatchManaged === 'X';
}
