import CommonLibrary from '../../../../Common/Library/CommonLibrary';
import Logger from '../../../../Log/Logger';
import IsS4ServiceIntegrationEnabled from '../../../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import { getOperation, getOperationsForBindPoint } from '../Controls/MeasuringPointsEDTOperationControl';
import EDTHelper from '../MeasuringPointsEDTHelper';

export default function MeasuringPointsEDTFiltersOnSuccess(context) {
    let filters = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().filters;
    if (Object.keys(filters.active).length) {
        return applyFilters(context, filters.active);
    } else {
        return resetFilters(context);
    }
}


function resetFilters(context) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    for (let section of sections) {
        section.setVisible(true);

        if (section.getExtension() && section.getExtension().constructor && section.getExtension().constructor.name === 'EditableDataTableViewExtension') {
            let extension = section.getExtension();
            if (extension) {
                extension.resetFilter();
            }
        }
    }
    return Promise.resolve();
}

async function applyFilters(context, filters) {
    let sections = context.getPageProxy().getControls()[0].getSections();
    let edtSectionIndex = 0;

    for (let index = 0; index < sections.length; index++) {
        let section = sections[index];

        if (section._context.element.definition._data.Class === 'EditableDataTableViewExtension') {
            await filterSection(context, section, sections[index - 1], filters, edtSectionIndex);
            edtSectionIndex++;
        }
    }

    return Promise.resolve();
}

export async function filterSection(context, edtSection, headerSection, filters, edtSectionIndex) {
    let filterResults = await filterEDT(context, edtSection, filters, edtSectionIndex);

    if (edtSection.getVisible() !== filterResults.Visibility) {
        headerSection.setVisible(filterResults.Visibility);
        edtSection.setVisible(filterResults.Visibility);
    }

    if (filterResults.Visibility) {
        await applyFiltersEDT(edtSection, filterResults);
    }
}

async function filterEDT(context, section, filters, edtSectionIndex, binding = context.getPageProxy().binding) {
    let sectionRowsBindings = CommonLibrary.getStateVariable(context, 'EDTSectionBindings')[edtSectionIndex] || [];
    let firstRow = sectionRowsBindings[0] ? sectionRowsBindings[0] : {};

    if (filters.equipment && filters.equipment.length) {
        if (!filters.equipment.includes(firstRow.EquipId)) {
            return { 'filteredRows': null, 'Visibility': false };
        }
    }

    if (filters.floc && filters.floc.length) {
        if (!filters.floc.includes(firstRow.FuncLocIdIntern)) {
            return { 'filteredRows': null, 'Visibility': false };
        }
    }

    if (filters.prt) {
        if (firstRow.WorkOrderTool?.length) {
            let filteredRows = [];
            
            sectionRowsBindings.forEach((rowBinding, index) => {
                let displayRow = false;
                const orderId = binding?.OrderId;
                const operationNo = binding?.OperationNo;
                if (orderId && operationNo && rowBinding.WorkOrderTool) {
                    displayRow = !!rowBinding.WorkOrderTool.find(tool => tool.OrderId === orderId && tool.OperationNo === operationNo);
                } else if (orderId && rowBinding.WorkOrderTool) {
                    displayRow = !!rowBinding.WorkOrderTool.find(tool => tool.OrderId === orderId);
                }
                if (displayRow) {
                    filteredRows.push(index);
                }
            });
            
            return { 'filteredRows': filteredRows, 'Visibility': filteredRows.length > 0 };
        } else {
            return { 'filteredRows': null, 'Visibility': false };
        }
    }            

    if ((filters.statuses && filters.statuses.length) || (filters.operations && filters.operations.length)) {
        let filteredRows = [];
        let extension = section.getExtension();
        let rowBindings = extension?.getRowBindings() || sectionRowsBindings;
        for (let i = 0; i < rowBindings.length; i++) {
            let rowBinding = rowBindings[i];
            let cachedRowBinding = EDTHelper.getCachedRowBinding(context, edtSectionIndex, rowBinding);
            let latestDoc = EDTHelper.getLatestMeasurementDoc(context, cachedRowBinding);

            if (filters.statuses && filters.statuses.length) {
                if (filters.statuses.includes('Empty')) {
                    if (rowBinding.CodeGroup && (!rowBinding.CharCode || rowBinding.IsCodeSufficient === 'X')) {
                        if (!latestDoc.ValuationCode) {
                            filteredRows.push(i);
                            continue;
                        }
                    } else {
                        if (!latestDoc.ReadingValue) {
                            filteredRows.push(i);
                            continue;
                        }
                    }
                }

                if (filters.statuses.includes('Error')) {
                    let cells = extension ? extension.getRowCells(i) : [];
                    if (cells.some(cell => cell._isError) || latestDoc._error === true) {
                        filteredRows.push(i);
                        continue;
                    }
                }
            }

            if (filters.operations && filters.operations.length) {
                await setOperationObjNumIfMissing(context, cachedRowBinding, latestDoc);
                if (filters.operations.includes(latestDoc.OperationObjNum)) {
                    filteredRows.push(i);
                    continue;
                }
            }
        }

        return { filteredRows, 'Visibility': filteredRows.length > 0 };
    } else {
        return { 'filteredRows': null, 'Visibility': true };
    }
}

async function applyFiltersEDT(edtSection, filterResults) {
    let extension = edtSection.getExtension();
    if (extension) {
        extension.resetFilter();

        let filteredRows = filterResults.filteredRows;
        if (filteredRows) {
            extension.applyFilter(filteredRows);
        }
    } else {
        await CommonLibrary.sleep(500);
        applyFiltersEDT(edtSection, filterResults);
    }
}

async function setOperationObjNumIfMissing(context, cachedRowBinding, latestDoc) {
    if (!latestDoc.OperationObjNum) {
        const isS4 = IsS4ServiceIntegrationEnabled(context);
        let operationsForPoint = getOperationsForBindPoint(context, cachedRowBinding.Point);
        let operation = await getOperation(context, cachedRowBinding, operationsForPoint, isS4)
            .catch(error => Logger.error('getOperation', error));
        latestDoc.OperationObjNum = isS4 ? operation.ItemNo : operation.ObjectKey;
    }
}
