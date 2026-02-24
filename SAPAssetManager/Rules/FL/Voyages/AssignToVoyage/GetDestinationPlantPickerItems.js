// Returns picker items for DestinationPlantFilter: only plants used as DestinationPlant in FldLogsVoyageMasters
// Display: Plant - PlantName, Return: Plant

export default async function GetDestinationPlantPickerItems(context) {
    const voyageResults = await context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'FldLogsVoyageMasters',
        [],
        '',
    );
    const plantSet = new Set();
    if (voyageResults && voyageResults.length > 0) {
        voyageResults.forEach(voyage => {
            if (voyage.DestinationPlant) {
                plantSet.add(voyage.DestinationPlant);
            }
        });
    }
    return Array.from(plantSet).map(plant => ({
        DisplayValue: plant,
        ReturnValue: plant,
    }));
}
