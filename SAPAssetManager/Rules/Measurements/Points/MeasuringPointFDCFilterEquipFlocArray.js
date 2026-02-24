import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function MeasuringPointFDCFilterEquipFlocQueryOptions(context) {
    const binding = context.getPageProxy().binding;
    const dataType = binding['@odata.type'];
    const controlName = context.getName();

    if (controlName === 'Equipment') {
        const EQUIPMENT_LIST_PICKER_ITEMS_MAP = {
            [libCommon.getGlobalDefinition(context, 'ODataTypes/WorkOrder.global')]: () => getEquipmentsForWorkOrder(context, binding),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/S4ServiceOrder.global')]: () => getEquipmentsForS4ServiceOrder(context, binding),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/Notification.global')]: () => getEquipmentsForNotification(context, binding),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/WorkOrderOperation.global')]: () => getEquipmentsForOperation(context, binding),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/Equipment.global')]: () => createEquipmentListPickerItems([binding]),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/FunctionalLocation.global')]: () => context.setVisible(false),
        };
        return EQUIPMENT_LIST_PICKER_ITEMS_MAP[dataType]?.();
    } else if (controlName === 'FuncLoc') {
        const FUNC_LOCS_LIST_PICKER_ITEMS_MAP = {
            [libCommon.getGlobalDefinition(context, 'ODataTypes/WorkOrder.global')]: () => getFuncLocsForWorkOrder(context, binding),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/S4ServiceOrder.global')]: () => getFuncLocsForS4ServiceOrder(context, binding),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/Notification.global')]: () => getFuncLocsForNotification(context, binding),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/WorkOrderOperation.global')]: () => getFuncLocsForOperation(context, binding),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/Equipment.global')]: () => context.setVisible(false),
            [libCommon.getGlobalDefinition(context, 'ODataTypes/FunctionalLocation.global')]: () => createFuncLocsListPickerItems([binding]),
        };
        return FUNC_LOCS_LIST_PICKER_ITEMS_MAP[dataType]?.();
    }

    return [];
}

function createEquipmentListPickerItems(equipmentData) {
    if (libVal.evalIsEmpty(equipmentData)) {
        return [];
    }
    return equipmentData.map(equipment => ({
        'DisplayValue': `${equipment.EquipId} - ${equipment.EquipDesc}`,
        'ReturnValue': equipment.EquipId,
    }));
}

function createFuncLocsListPickerItems(funcLocsData) {
    if (libVal.evalIsEmpty(funcLocsData)) {
        return [];
    }
    return funcLocsData.map(funcloc => ({
        'DisplayValue': `${funcloc.FuncLocId} - ${funcloc.FuncLocDesc}`,
        'ReturnValue': funcloc.FuncLocId,
    }));
}

function getEquipmentsForWorkOrder(context, binding) {
    // Get header-level equipment as Promise<Object>
    let work_order_equipment_promise = context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/Equipment`, [], '$expand=MeasuringPoints').then(result => result.getItem(0));
    // Get list of operation-level equipment as Promise<Array<Object>>
    let work_order_op_equipments_promise = context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/Operations`, [], '').then(result => {
        return Promise.all(result._array.map(async operation => {
            return await context.read('/SAPAssetManager/Services/AssetManager.service', `${operation['@odata.readLink']}/EquipmentOperation`, [], '$expand=MeasuringPoints').then(result2 => Array.from(result2));
        })).then(array => array.flat(1));
    });

    return Promise.all([work_order_equipment_promise, work_order_op_equipments_promise]).then(([woEquipment, operationsEquipments]) => {
        const equipments = [];

        if (woEquipment?.MeasuringPoints?.length > 0) {
            equipments.push(woEquipment);
        }

        operationsEquipments.forEach(operationEquip => {
            if (operationEquip.MeasuringPoints?.length > 0 && !equipments.some(equip => equip.EquipId === operationEquip.EquipId)) {
                equipments.push(operationEquip);
            }
        });

        const options = createEquipmentListPickerItems(equipments);

        context.setVisible(!!options.length);

        return options;
    });
}

function getFuncLocsForWorkOrder(context, binding) {
    // Get list of header-level FLOCs as Promise<Object>
    let work_order_floc_promise = context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/FunctionalLocation`, [], '$expand=MeasuringPoints').then(result => result.getItem(0));
    // Get list of operation-level FLOCs as Promise<Array<Object>>
    let work_order_op_flocs_promise = context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/Operations`, [], '').then(result => {
        return Promise.all(result._array.map(async operation => {
            return await context.read('/SAPAssetManager/Services/AssetManager.service', `${operation['@odata.readLink']}/FunctionalLocationOperation`, [], '$expand=MeasuringPoints').then(result2 => result2._array);
        })).then(array => array.flat(1));
    });

    return Promise.all([work_order_floc_promise, work_order_op_flocs_promise]).then(([woFLoc, operationsFLocs]) => {
        const flocs = [];

        if (woFLoc?.MeasuringPoints?.length > 0) {
            flocs.push(woFLoc);
        }

        operationsFLocs.forEach(operationFloc => {
            if (operationFloc.MeasuringPoints?.length > 0 && !flocs.some(floc => floc.FuncLocId === operationFloc.FuncLocId)) {
                flocs.push(operationFloc);
            }
        });

        const options = createFuncLocsListPickerItems(flocs);

        context.setVisible(!!options.length);

        return options;
    });
}

function getEquipmentsForS4ServiceOrder(context, binding) {
    let orderLink = binding['@odata.readLink'];
    return context.read('/SAPAssetManager/Services/AssetManager.service', orderLink, [], '$expand=RefObjects_Nav/Equipment_Nav/MeasuringPoints,ServiceItems_Nav/RefObjects_Nav/Equipment_Nav/MeasuringPoints').then(result => {
        let order = result.getItem(0);
        const equipments = [];
        for (let refObject of order.RefObjects_Nav) {
            if (refObject.Equipment_Nav && refObject.Equipment_Nav.MeasuringPoints && refObject.Equipment_Nav.MeasuringPoints.length) {
                equipments.push(refObject.Equipment_Nav);
            }
        }

        for (let item of order.ServiceItems_Nav) {
            for (let refObject of item.RefObjects_Nav) {
                if (refObject.Equipment_Nav && refObject.Equipment_Nav.MeasuringPoints && refObject.Equipment_Nav.MeasuringPoints.length) {
                    equipments.push(refObject.Equipment_Nav);
                }
            }
        }

        return createEquipmentListPickerItems(equipments);
    });
}

function getFuncLocsForS4ServiceOrder(context, binding) {
    let orderLink = binding['@odata.readLink'];
    return context.read('/SAPAssetManager/Services/AssetManager.service', orderLink, [], '$expand=RefObjects_Nav/FuncLoc_Nav/MeasuringPoints,ServiceItems_Nav/RefObjects_Nav/FuncLoc_Nav/MeasuringPoints').then(result => {
        let order = result.getItem(0);
        const flocs = [];

        for (let refObject of order.RefObjects_Nav) {
            if (refObject.FuncLoc_Nav && refObject.FuncLoc_Nav.MeasuringPoints && refObject.FuncLoc_Nav.MeasuringPoints.length) {
                flocs.push(refObject.FuncLoc_Nav);
            }
        }

        for (let item of order.ServiceItems_Nav) {
            for (let refObject of item.RefObjects_Nav) {
                if (refObject.FuncLoc_Nav && refObject.FuncLoc_Nav.MeasuringPoints && refObject.FuncLoc_Nav.MeasuringPoints.length) {
                    flocs.push(refObject.FuncLoc_Nav);
                }
            }
        }

        return createFuncLocsListPickerItems(flocs);
    });
}

function getEquipmentsForNotification(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/Equipment`, [], '').then(result => {
        let options = [];

        if (result.length > 0) {
            options = createEquipmentListPickerItems([result.getItem(0)]);
        }
        context.setVisible(!!options.length);

        return options;
    });
}

function getFuncLocsForNotification(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}/FunctionalLocation`, [], '').then(result => {
        let options = [];

        if (result.length > 0) {
            options = createFuncLocsListPickerItems([result.getItem(0)]);
        }
        context.setVisible(!!options.length);

        return options;
    });
}

function getEquipmentsForOperation(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}`, [], '$expand=EquipmentOperation/MeasuringPoints,Tools/PRTPoint/Equipment').then(result => result.getItem(0))
        .then(operation => {
            const equipments = [];

            if (operation?.EquipmentOperation.MeasuringPoints?.length > 0) {
                equipments.push(operation.EquipmentOperation);
            }

            if (context.evaluateTargetPathForAPI('#Page:-Previous')._page.previousPage.definition.name === 'PRTListViewPage') {
                operation?.Tools.forEach(prt => {
                    if (prt.PRTPoint?.Equipment && !equipments.some(equip => equip.EquipId === prt.PRTPoint.Equipment.EquipId)) {
                        equipments.push(prt.PRTPoint.Equipment);
                    }
                });
            }

            const options = createEquipmentListPickerItems(equipments);
            context.setVisible(!!options.length);

            return options;
        });
}

function getFuncLocsForOperation(context, binding) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${binding['@odata.readLink']}`, [], '$expand=FunctionalLocationOperation/MeasuringPoints,Tools/PRTPoint/FunctionalLocation').then(result => result.getItem(0))
        .then(operation => {
            const flocs = [];

            if (operation?.FunctionalLocationOperation.MeasuringPoints?.length > 0) {
                flocs.push(operation.FunctionalLocationOperation);
            }

            if (context.evaluateTargetPathForAPI('#Page:-Previous')._page.previousPage.definition.name === 'PRTListViewPage') {
                operation?.Tools.forEach(prt => {
                    if (prt.PRTPoint?.FunctionalLocation && !flocs.some(floc => floc.FuncLocId === prt.PRTPoint.FunctionalLocation.FuncLocId)) {
                        flocs.push(prt.PRTPoint.FunctionalLocation);
                    }
                });
            }


            const options = createFuncLocsListPickerItems(flocs);
            context.setVisible(!!options.length);

            return options;
        });
}
