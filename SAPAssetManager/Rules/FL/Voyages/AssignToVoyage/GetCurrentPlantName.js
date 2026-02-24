import CommonLibrary from '../../../Common/Library/CommonLibrary';

// Rule to get the current plant name for the filter control
export default function GetCurrentPlantName() {
    const plant = CommonLibrary.getUserDefaultPlant();
    return plant || '-';
}
