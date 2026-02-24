
import { SplitReadLink } from '../../Common/Library/ReadLinkUtils';
import common from '../../Common/Library/CommonLibrary';
import { setToSBin } from '../Stock/Transfer/OnSLocToToSelected';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';

export default function UpdateMaterialPlantAndStorageLocationFields(context) {
    ResetValidationOnInput(context);

    const form = context.getPageProxy().getControl('FormCellContainer');
    const plant = form.getControl('PlantSimple');
    const quantity = form.getControl('QuantitySimple');
    const batchToListPicker = form.getControl('BatchNumToListPicker');
    const autoSerialNumberSwitch = form.getControl('AutoSerialNumberSwitch');
    const serialNumButton = form.getControl('SerialPageNav');
    const plantToListPicker = form.getControl('PlantToListPicker');
    const storageLocationToListPicker = form.getControl('StorageLocationToListPicker');
    const uom = form.getControl('UOMSimple');
    const storageLocationListPicker = form.getControl('StorageLocationPicker');
    const valuationTo = form.getControl('ValuationToPicker');
    const valuation = form.getControl('ValuationTypePicker');
    const batchListPicker = form.getControl('BatchListPicker');
    const storageBin = form.getControl('StorageBinSimple');
    const MatrialListPicker = form.getControl('MatrialListPicker').getValue();

    const objectType = common.getStateVariable(context, 'IMObjectType');
    const move = common.getStateVariable(context, 'IMMovementType');

    const flags = {
        valuationFlag: false,
        valuationToFlag: false,
        batchIndicatorFlag: false,
        serial: false,
        quantityFlag: true,
        quantityClear: true,
        batchToIndicatorFlag: false,
    };

    const values = {
        storageBinValue: '',
        uomValue: '',
        material: null,
        materialPlant: null,
        valuationItems: [],
        valuationItemsTo: [],
        plantValue: '',
        slocEntitySet: '',
    };

    initValueSetting();

    if (MatrialListPicker.length === 0) {
        return true;
    }

    values.plantValue = SplitReadLink(context.getValue()[0].ReturnValue).Plant;
    const entitySetReadLink = MatrialListPicker[0].ReturnValue;

    const materialPlantExpand = '$expand=Material,Material/SerialNumbers';

    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySetReadLink, [], materialPlantExpand)
        .then(async result => {
            if (result && result.length > 0) {
                values.materialPlant = result.getItem(0);
                values.material = values.materialPlant.MaterialNum;

                context.getPageProxy().getClientData().Material = values.material;

                if (values.materialPlant.BatchIndicator === 'X') {
                    flags.batchIndicatorFlag = true;
                }
                if (values.materialPlant.SerialNumberProfile) {
                    flags.serial = true;
                    flags.quantityFlag = false;
                    common.setStateVariable(context, 'MaterialReadLink', values.materialPlant['@odata.readLink']);
                }

                values.valuationItems = await fetchValuations(context, values.material, values.materialPlant.Plant);
                if (values.valuationItems.length) {
                    flags.valuationFlag = true;
                }

                if (objectType === 'ADHOC' && move === 'T' && plantToListPicker.getValue().length) {
                    const toPlant = plantToListPicker.getValue()[0].ReturnValue;
                    values.valuationItemsTo = await fetchValuations(context, values.material, toPlant);
                    if (values.valuationItemsTo.length) {
                        flags.valuationToFlag = true;
                    }
                }

                if (flags.batchIndicatorFlag && (objectType !== 'ADHOC' || (objectType === 'ADHOC' && move === 'T'))) {
                    flags.batchToIndicatorFlag = true;
                }

                common.setStateVariable(context, 'SerialNumbers', { actual: null, initial: null });

                if (objectType === 'ADHOC') {
                    common.setStateVariable(context, 'BatchRequiredForFilterADHOC', flags.batchIndicatorFlag);
                }

                values.storageBinValue = '';
                values.uomValue = values.materialPlant.Material.BaseUOM;

                if (values.materialPlant.MaterialSLocs?.length > 0) {
                    const sloc = common.getListPickerValue(storageLocationListPicker.getValue());
                    if (sloc) {
                        const materialSLoc = values.materialPlant.MaterialSLocs.find(s => s.StorageLocation === sloc);
                        values.storageBinValue = materialSLoc ? materialSLoc.StorageBin : '';
                    }
                }
            }

            settingValue(plant, values.plantValue, true, true);
            settingValue(uom, values.uomValue, true, true);
            settingValue(storageBin, values.storageBinValue, true, !values.storageBinValue);
            settingValue(autoSerialNumberSwitch, '', flags.serial && move === 'R', flags.serial && move === 'R');
            settingValue(serialNumButton, '', flags.serial, flags.serial);

            if (flags.quantityClear) {
                settingValue(quantity, '', true, flags.quantityFlag);
            } else {
                settingValue(quantity, quantity.getValue()[0].ReturnValue, true, flags.quantityFlag);
            }

            settingValue(batchListPicker, '', flags.batchIndicatorFlag, flags.batchIndicatorFlag);
            settingValue(batchToListPicker, '', flags.batchIndicatorFlag, flags.batchIndicatorFlag);

            valuation.setVisible(flags.valuationFlag);
            valuationTo.setVisible(flags.valuationToFlag);

            if (objectType === 'ADHOC') {
                if (flags.valuationFlag) {
                    const pickerItemsFrom = values.valuationItems.map(v => ({
                        ReturnValue: v.ValuationType,
                        DisplayValue: v.ValuationType,
                    }));
                    valuation.setPickerItems(pickerItemsFrom);
                    valuation.setEditable(true);
                } else {
                    valuation.setPickerItems([]);
                    valuation.setEditable(false);
                }
                if (flags.valuationToFlag) {
                    const pickerItemsTo = values.valuationItemsTo.map(v => ({
                        ReturnValue: v.ValuationType,
                        DisplayValue: v.ValuationType,
                    }));
                    valuationTo.setPickerItems(pickerItemsTo);
                    valuationTo.setEditable(true);
                } else {
                    valuationTo.setPickerItems([]);
                    valuationTo.setEditable(false);
                }
            }

            if (flags.batchIndicatorFlag && objectType === 'ADHOC' && values.material) {
                if ((move === 'R' || move === 'I' || move === 'T') && values.materialPlant) {
                    let batchQuery = `$filter=MaterialNum eq '${values.material}' and Plant eq '${values.materialPlant.Plant}'`;
                    if (move === 'I') {
                        const sloc = common.getListPickerValue(storageLocationListPicker.getValue());
                        batchQuery += ` and StorageLocation eq '${sloc}'`;
                        values.slocEntitySet = 'MaterialBatchStockSet';
                    } else {
                        values.slocEntitySet = 'MaterialBatches';
                    }
                    const batchListSpecifier = batchListPicker.getTargetSpecifier();
                    batchListSpecifier.setQueryOptions(batchQuery);
                    batchListSpecifier.setEntitySet(values.slocEntitySet);
                    batchListSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                    settingValue(batchListPicker, '');
                    batchListPicker.setTargetSpecifier(batchListSpecifier);
                    batchListPicker.redraw();
                }

                if (batchToListPicker && move === 'T' && plantToListPicker.getValue().length > 0) {
                    const batchQueryTo = `$filter=MaterialNum eq '${values.material}' and Plant eq '${plantToListPicker.getValue()[0].ReturnValue}'`;
                    const batchToListSpecifier = batchToListPicker.getTargetSpecifier();
                    batchToListSpecifier.setQueryOptions(batchQueryTo);
                    batchToListSpecifier.setEntitySet('MaterialBatches');
                    batchToListSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
                    settingValue(batchToListPicker, '');
                    batchToListPicker.setTargetSpecifier(batchToListSpecifier);
                    batchToListPicker.redraw();
                }

                if (objectType === 'ADHOC' && move === 'T' && plantToListPicker.getValue().length) {
                    const toPlant = plantToListPicker.getValue()[0].ReturnValue;
                    values.valuationItemsTo = await fetchValuations(context, values.material, toPlant);
                    if (values.valuationItemsTo.length) {
                        flags.valuationToFlag = true;
                    }
                }
            }

            const uomListPickerSpecifier = uom.getTargetSpecifier();
            uomListPickerSpecifier.setEntitySet('MaterialUOMs');
            uomListPickerSpecifier.setService('/SAPAssetManager/Services/AssetManager.service');
            uom.setTargetSpecifier(uomListPickerSpecifier);
            uom.redraw();

            if (storageLocationToListPicker.getValue().length && plantToListPicker.getValue().length) {
                const moveStorageBin = form.getControl('ToStorageBinSimple');
                const slocToVal = storageLocationToListPicker.getValue()[0].ReturnValue;
                const plantToVal = plantToListPicker.getValue()[0].ReturnValue;
                if (plantToVal && slocToVal && values.material) {
                    return context.read(
                        '/SAPAssetManager/Services/AssetManager.service',
                        'MaterialSLocs',
                        [],
                        `$select=StorageBin&$filter=MaterialNum eq '${values.material}' and Plant eq '${plantToVal}' and StorageLocation eq '${slocToVal}'`,
                    ).then(val => {
                        if (val && val.length === 0) {
                            return context.read(
                                '/SAPAssetManager/Services/OnlineAssetManager.service',
                                'MaterialSLocs',
                                [],
                                `$select=StorageBin&$filter=MaterialNum eq '${values.material}' and Plant eq '${plantToVal}' and StorageLocation eq '${slocToVal}'`,
                            ).then(value => setToSBin(value, moveStorageBin))
                                .catch(() => setToSBin([], moveStorageBin));
                        }
                        return setToSBin(val, moveStorageBin);
                    });
                } else {
                    settingValue(moveStorageBin, '', true, false);
                    moveStorageBin.redraw();
                }
            }
            return true;
        });

    function initValueSetting() {
        settingValue(batchListPicker, '', flags.batchIndicatorFlag, true);
        settingValue(batchToListPicker, '', flags.batchIndicatorFlag, true);
        settingValue(storageBin, values.storageBinValue, true, !values.storageBinValue);
        settingValue(uom, values.uomValue, true, false);
        valuation.setVisible(flags.valuationFlag);
        valuation.setValue('');
        valuationTo.setValue('');
        valuationTo.setVisible(flags.valuationToFlag);
        valuation.setPickerItems([]);
        valuation.setEditable(flags.valuationFlag);
        valuationTo.setPickerItems([]);
        valuationTo.setEditable(flags.valuationToFlag);
    }

    function settingValue(control, value, visible = true, editable = true) {
        control.setValue(value);
        control.setVisible(visible);
        control.setEditable(editable);
    }

    function fetchValuations(ruleContext, materialNumber, plantCode) {
        if (!materialNumber || !plantCode) {
            return Promise.resolve([]);
        }
        const queryOptions = `$select=ValuationType,ValuationArea,ValuationCategory&$filter=Material eq '${materialNumber}' and ValuationArea eq '${plantCode}'&$orderby=ValuationType`;
        return ruleContext.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialValuations', [], queryOptions)
            .then(resultSet => {
                const valuationTypes = [];
                const deDupSet = new Set();
                if (resultSet?.getItem) {
                    for (let i = 0; i < resultSet.length; i++) {
                        const row = resultSet.getItem(i);
                        const valuationType = row?.ValuationType;
                        if (valuationType && !deDupSet.has(valuationType)) {
                            deDupSet.add(valuationType);
                            valuationTypes.push({
                                ValuationType: valuationType,
                                ValuationCategory: row.ValuationCategory,
                                ValuationArea: row.ValuationArea,
                            });
                        }
                    }
                }
                return valuationTypes;
            })
            .catch(() => []);
    }
}
