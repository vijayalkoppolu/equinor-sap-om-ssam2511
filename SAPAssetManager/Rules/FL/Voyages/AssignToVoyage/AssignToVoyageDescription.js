export default function AssignToVoyageSubhead(context) {
    const binding = context.binding;

    const join = (firstValue, secondValue) => {
        if (firstValue && secondValue) return `${firstValue} / ${secondValue}`;
        return firstValue || secondValue || '';
    };

    const line1 = join(binding.SourcePlant, binding.SourceStage);
    const line2 = join(binding.DestinationPlant, binding.DestinationStage);

    return [line1, line2].filter(Boolean).join('\n');
}
