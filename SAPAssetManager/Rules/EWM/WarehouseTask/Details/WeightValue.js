export default function WeightValue(context) {
    const { LoadingWeight: weight = '-', WeightUnit: unit = '-' } = context.binding || {};
    return (weight === '-' && unit === '-') ? '-' : `${weight} ${unit}`;
}
