export default function VolumeValue(context) {
    const { LoadingVolume: volume = '-', VolumeUnit: unit = '-' } = context.binding || {};
    return (volume === '-' && unit === '-') ? '-' : `${volume} ${unit}`;
}
