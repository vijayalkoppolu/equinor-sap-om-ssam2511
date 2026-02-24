
export default function MeasuringPointReadingValue(clientAPI) {
    const binding = clientAPI.binding;
    const decimal = Number(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/MeasuringPoints/FormatDecimalPrecision.global').getValue());
    let value = '-';

    if (binding.ReadingValue || (binding.HasReadingValue === 'X' && binding.ReadingValue === 0)) {
        const uom = binding.MeasuringPoint?.UoM || binding.UOM;
        const readingValue = clientAPI.formatNumber(binding.ReadingValue, '', { maximumFractionDigits: decimal, minimumFractionDigits: 0 });
        
        value = `${readingValue} ${uom}`;
    }

    return value;
}
