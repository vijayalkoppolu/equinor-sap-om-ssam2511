import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import ODataLibrary from '../OData/ODataLibrary';

export default async function PartUpdateNav(context) {
    if (ODataLibrary.isLocal(context.binding)) {
        const isBOMItem = await isPartCreatedFromBOM(context, context.binding);
        libCom.setOnCreateUpdateFlag(context, 'UPDATE');
        context.setActionBinding({ bomItem: isBOMItem, ...context.binding });
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartCreateUpdateNav.action');
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartUpdateNotEditableMessage.action');
    }
}

async function isPartCreatedFromBOM(context, binding) {
    const plant = binding.Plant;
    const storageLoc = binding.StorageLocation;
    const materialNum = binding.MaterialNum;

    if (plant && storageLoc && materialNum) {
        const materialSLocs = await checkMaterialSLocsCount(context, plant, storageLoc, materialNum);
        if (materialSLocs) {
            return false;
        }
    }

    if (materialNum) {
        const bomItems = await checkBOMItemsCount(context, materialNum);
        if (bomItems) {
            return true;
        }
    }

    return false;
}

function checkMaterialSLocsCount(context, plant, storageLoc, materialNum) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialSLocs',
        `$filter=Plant eq '${plant}' and StorageLocation eq '${storageLoc}' and MaterialNum eq '${materialNum}'`).catch(error => {
            Logger.error('checkMaterialSLocsCount', error);
            return 0;
        });
}

function checkBOMItemsCount(context, materialNum) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'BOMItems',
        `$filter=Component eq '${materialNum}'`).catch(error => {
            Logger.error('checkBOMItemsCount', error);
            return 0;
        });
}
