import Logger from '../../Log/Logger';

export default async function PartDefaultValue(context, binding = context.getPageProxy().binding) {
    const plant = binding.Plant;
    const storageLoc = binding.StorageLocation;
    const materialNum = context.binding['@odata.type'] === '#sap_mobile.BOMItem' ? context.binding.Component : binding.MaterialNum;

    if (plant && storageLoc && materialNum) {
        const materialSLocs = await checkMaterialSLocsExists(context, plant, storageLoc, materialNum);
        if (materialSLocs) {
            return `MaterialSLocs(Plant='${plant}',StorageLocation='${storageLoc}',MaterialNum='${materialNum}')`;
        }
    }

    return '';

}

function checkMaterialSLocsExists(context, plant, storageLoc, materialNum) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs',
        `$filter=Plant eq '${plant}' and StorageLocation eq '${storageLoc}' and MaterialNum eq '${materialNum}'`)
        .catch((error) => {
            Logger.error('checkMaterialSLocsExists', error);
            return 0;
        });
}
