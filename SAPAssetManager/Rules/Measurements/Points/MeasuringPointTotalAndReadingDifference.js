import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointTotalAndReadingDifference(context) {
    const binding = context.binding;

    const totalReading = Math.round(binding.TotalReadingValue || 0);

    if (ValidationLibrary.evalIsNotEmpty(binding.CounterReadingDifference)) {
        return `${totalReading} (${binding.CounterReadingDifference})`;
    }

    return totalReading || '-';
}
