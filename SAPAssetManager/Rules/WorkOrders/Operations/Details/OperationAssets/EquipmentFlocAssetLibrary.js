import ValidationLibrary from '../../../../Common/Library/ValidationLibrary';
import { GetEquipmentIconImages, GetFlocIconImages } from '../../../../Common/TechnicalObjectListViewIconImages';
import EquipmentDetailsNav from '../../../../Equipment/EquipmentDetailsNav';
import FunctionalLocationDetailsNav from '../../../../FunctionalLocation/FunctionalLocationDetailsNav';
import NavToFunctionalLocationDetails from '../../../../FunctionalLocation/NavToFunctionalLocationDetails';
import OnlineSearchEquipmentDetailsNav from '../../../../OnlineSearch/Equipment/OnlineSearchEquipmentDetailsNav';
import OperationDetailsEquipmentEntitySets from '../../OperationDetailsEquipmentEntitySet';
import OperationDetailsFLOCEntitySet from '../../OperationDetailsFLOCEntitySet';


const EQUIPMENT_DEFAULT_EXPAND = 'ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments/Document';

/**
 * @typedef AssetType
 * @prop {string} title
 * @prop {string} subhead
 * @prop {string} onPress
 * @prop {string} footnote
 * @prop {string[]} icons
 */

export class EquipmentFlocAssetLibrary {
    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetDetailImage(context) {
        return context.binding.detailImage;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetTitle(context) {
        return context.binding.title;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetSubhead(context) {
        return context.binding.subhead;
    }

    /** @param {IPageProxy & {binding: AssetType}} context  */
    static AssetIcons(context) {
        return context.binding.icons;
    }

    /** @param {IPageProxy}} context  */
    static AssetOnPress(context) {
        return context.getPageProxy().getActionBinding().onPress(context);
    }

    /** @param {IPageProxy}} context  */
    static AssetFootnote(context) {
        return context.binding.footnote;
    }

    /** @param {IPageProxy & {binding: MyWorkOrderOperation}} context  */
    static WorkOrderOperationAssets(context) {
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', OperationDetailsEquipmentEntitySets(context), [], `$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', OperationDetailsFLOCEntitySet(context), [], '$expand=FuncLocDocuments/Document'),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static WorkOrderAssets(context) {
        const binding = context.binding;
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', [], `$filter=EquipId eq '${binding.HeaderEquipment}'&$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', [], `$filter=FuncLocIdIntern eq '${binding.HeaderFunctionLocation}'`),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static WCMObjectsAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/MyEquipments`, []),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/MyFunctionalLocations`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static WorkOrderSubOperationAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/EquipmentSubOperation`, [], `$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/FunctionalLocationSubOperation`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static OnlineWorkOrderSubOperationAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/EquipmentSubOperation`, [], `$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/FunctionalLocationSubOperation`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static NotificationAssets(context) {
        const readLink = context.binding['@odata.readLink'];
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/Equipment`, [], `$expand=${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${readLink}/FunctionalLocation`, []),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static ServiceQuotationAssets(context) {
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObjects_Nav`, [], `$filter=sap.entityexists(Equipment_Nav)&$expand=Equipment_Nav/${EQUIPMENT_DEFAULT_EXPAND}`),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObjects_Nav`, [], '$filter=sap.entityexists(FuncLoc_Nav)&$expand=FuncLoc_Nav/FuncLocDocuments/Document'),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    static ServiceConfirmationAssets(context) {
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObjects_Nav`, [], '$filter=sap.entityexists(MyEquipment_Nav)&$expand=MyEquipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,MyEquipment_Nav/EquipDocuments/Document'),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObjects_Nav`, [], '$filter=sap.entityexists(MyFunctionalLocation_Nav)&$expand=MyFunctionalLocation_Nav/FuncLocDocuments/Document'),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }

    /**
     * Retrieves equipment and functional location, preferring local store but falling back to online if not found.
     * If at least one asset is found (local or online), returns the prepared asset items.
     *
     * @param {IClientAPI} context
     * @param {Object} [binding=context.binding] - The binding object containing HeaderEquipment and HeaderFunctionLocation properties
     * @returns {Promise<Array>} Array of prepared asset items, or empty array if none found
     */
    static async OnlineBusinessObjectAssets(context, binding = context.binding) {
        const [equipment, floc] = await Promise.all([
            readAssetLocalOrOnline(
                context,
                binding?.HeaderEquipment,
                'MyEquipments',
                'Equipments',
                "$filter=EquipId eq '{id}'",
            ),
            readAssetLocalOrOnline(
                context,
                binding?.HeaderFunctionLocation,
                'MyFunctionalLocations',
                'FunctionalLocations',
                "$filter=FuncLocIdIntern eq '{id}'",
            ),
        ]);
        if ((equipment && equipment.length > 0) || (floc && floc.length > 0)) {
            // If at least one is found (local or online), return what is available
            return prepareAssetsItems(context, [equipment, floc]);
        }
        return [];
    }

    static ServiceRequestAssets(context) {
        return Promise.all([
            context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObj_Nav`, [], '$filter=sap.entityexists(MyEquipment_Nav)&$expand=MyEquipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,MyEquipment_Nav/EquipDocuments/Document'),
            context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/RefObj_Nav`, [], '$filter=sap.entityexists(MyFunctionalLocation_Nav)&$expand=MyFunctionalLocation_Nav/FuncLocDocuments/Document'),
        ])
            .then((response) => prepareAssetsItems(context, response));
    }
}

/**
 * @param {MyFunctionalLocation} floc
 * @returns {Promise<AssetType>} */
function flocToAsset(context, floc, isOnline) {
    if (floc.FuncLoc_Nav) {
        floc = floc.FuncLoc_Nav;
    }
    if (floc.MyFunctionalLocation_Nav) {
        floc = floc.MyFunctionalLocation_Nav;
    }

    return {
        ...floc,
        title: floc.FuncLocDesc,
        onPress: isOnline ? NavToFunctionalLocationDetails : FunctionalLocationDetailsNav,
        preserveIconStackSpacing: false,
        subhead: floc.FuncLocId,
        detailImage: '$(PLT, /SAPAssetManager/Images/DetailImages/Floc.png, /SAPAssetManager/Images/DetailImages/Floc.android.png)',
        footnote: context.localizeText('functional_location'),
        icons: GetFlocIconImages(context, floc),
    };
}

/**
 * @param {IClientAPI} context
 * @param {MyEquipment} equipment
 * @returns {Promise<AssetType>} */
function equipmentToAsset(context, equipment, isOnline) {
    if (equipment.Equipment_Nav) {
        equipment = equipment.Equipment_Nav;
    }
    if (equipment.MyEquipment_Nav) {
        equipment = equipment.MyEquipment_Nav;
    }

    return {
        ...equipment,
        title: equipment.EquipDesc,
        onPress: isOnline ? OnlineSearchEquipmentDetailsNav : EquipmentDetailsNav,
        preserveIconStackSpacing: true,
        subhead: equipment.EquipId,
        detailImage: '$(PLT, /SAPAssetManager/Images/DetailImages/Equipment.png, /SAPAssetManager/Images/DetailImages/Equipment.android.png)',
        footnote: context.localizeText('equipment'),
        icons: GetEquipmentIconImages(context, equipment),
        statusText: equipment.ObjectStatus_Nav?.SystemStatus_Nav?.StatusText || equipment?.SysStatus,
    };
}

function prepareAssetsItems(context, [equipment, floc]) {
    return [[equipment, equipmentToAsset], [floc, flocToAsset]]
        .map(([x, mapping]) => !ValidationLibrary.evalIsEmpty(x) && mapping(context, x.getItem(0), x.getItem(0)?.isOnline || false))
        .filter(x => !!x);
}

/**
 * Attempts to read an asset by id from local store, and if not found, from online store.
 * @param {IClientAPI} context
 * @param {string} id - The id value to filter on
 * @param {string} localEntitySet - The local entity set name
 * @param {string} onlineEntitySet - The online entity set name
 * @param {string} filterTemplate - The filter string, use {id} as placeholder
 * @returns {Promise<Array>} The found objects (empty array if not found)
 */
async function readAssetLocalOrOnline(context, id, localEntitySet, onlineEntitySet, filterTemplate) {
    if (!id) return [];
    const filter = filterTemplate.replace('{id}', id);
    try {
        const local = await context.read('/SAPAssetManager/Services/AssetManager.service', localEntitySet, [], filter);
        if (local && local.length > 0) {
            return local;
        }
        const online = await context.read('/SAPAssetManager/Services/OnlineAssetManager.service', onlineEntitySet, [], filter);
        return (online || []).map(obj => ({ ...obj, isOnline: true }));
    } catch (error) {
        console.error('Error reading asset data:', error);
        return [];
    }
}
