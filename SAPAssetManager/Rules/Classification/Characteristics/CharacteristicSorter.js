export default function CharacteristicSorter(a, b) {
    return CharacteristicValueSorter(a.ReturnValue, b.ReturnValue);
}

export function CharacteristicValueSorter(a, b) {
    if (Number.isNaN(parseInt(a.split('|')[1])) || Number.isNaN(parseInt(b.split('|')[1]))) {
        return a.localeCompare(b);
    }
    return parseInt(a.split('|')[1]) - parseInt(b.split('|')[1]);
}
