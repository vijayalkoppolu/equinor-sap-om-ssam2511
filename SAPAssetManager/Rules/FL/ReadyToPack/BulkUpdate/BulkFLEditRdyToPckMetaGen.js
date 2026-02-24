import { GetEDTColumns, GetEDTItems, GetItemEDTSection, GetItemSearchAndSelectSection, GetItemTitleDescriptionSection } from './BulkFLEditRdyToPckPageMetadata';
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import QueryBuilder from '../../../Common/Query/QueryBuilder';
import SelectAllHeight from '../../../Inventory/IssueOrReceipt/BulkUpdate/SelectAllHeight';
import ItemHeaderHeight from '../../../Inventory/IssueOrReceipt/BulkUpdate/ItemHeaderHeight';
import {EDTReadyToPackColumnWidth}  from '../../../FL/BulkUpdate/EDTConfigurations';
import EDTHeight from '../../../Inventory/IssueOrReceipt/BulkUpdate/EDTConfigurations';
import EDTSoftInputModeConfig from '../../../Extensions/EDT/EDTSoftInputModeConfig';
import { ReadyToPackStatus } from '../../Common/FLLibrary';
export default function BulkFLEditRdyToPckMetaGen(clientAPI) {
    EDTSoftInputModeConfig(clientAPI);
    let page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/FL/PackContainers/ReadyToPack/BulkUpdate.page');
    return GetItems(clientAPI).then((items) => {
        if (items) {
            addSections(clientAPI, page, items);
        }
        return page;
    });
}

function addItemSearchAndSelectSection(context, page, config, properties) {
    page.Controls[0].Sections.push(GetItemSearchAndSelectSection(context, config, properties));
}

function addItemSection(context, page, config, properties) {
    let columns = GetEDTColumns(config);
    let items = GetEDTItems();
    properties.columns = columns;
    properties.items = items;

    page.Controls[0].Sections.push(GetItemTitleDescriptionSection(context, config, properties));
    page.Controls[0].Sections.push(GetItemEDTSection(config, properties));
}

function addSections(context, page, items) {
    let config = GetConfigurations(context);
    config.totalItems = items.length;
    if (libCom.getStateVariable(context, 'BulkUpdateItem') === undefined) {
        libCom.setStateVariable(context, 'BulkUpdateItem', config.totalItems);
    }
    libCom.setStateVariable(context, 'BulkUpdateTotalItems', config.totalItems);
    const properties = {
        EntitySet: 'FldLogsPackCtnRdyPcks',
    };
    addItemSearchAndSelectSection(context, page, config, properties);

    for (const item of items) {
        addItemSection(context, page, config, item.properties);
    }
}

/**
 * Returns the configurations for extensions (select all, header, EDT) for the given device.
 * 
 * Following dimensions have been tested across various devices iPhone, iPad, android phone, android tablet.
 * These confirgurations work well across all these devices.
 * @param {*} context 
 * @returns 
 */
function GetConfigurations(context) {
    let config = Object();
    config.SelectAllHeight = SelectAllHeight(context);
    config.ItemHeaderHeight = ItemHeaderHeight(context);
    config.ItemEDTHeight = EDTHeight(context);
    config.ItemEDTColWidth = EDTReadyToPackColumnWidth(context);
    return config;
}

async function GetItems(context) {
    const target = 'FldLogsPackCtnRdyPcks';
    let queryTarget = `$filter=FldLogsShptItmStsCode ne '${ReadyToPackStatus.Dispatched}'`;
    const sectionedTable = context.getPageProxy().getControl('SectionedTable');
    const filters = sectionedTable.filters;
    if (filters && filters.length > 0) {
        const filterItems = filters[0].filterItems;
         // Build a filter string: (firstitem or seconditem or thirditem)
        const orFilter = filterItems.map(item => `${item}`).join(' or ');
        queryTarget = `$filter=(FldLogsShptItmStsCode ne '${ReadyToPackStatus.Dispatched}' and (${orFilter}))`;
    }
    const expand = '&$expand=FldLogsPackCtnItemStatus_Nav,FldLogsCtnPackageId_Nav,FldLogsOrderCategory_Nav,FldLogsPlant_Nav';
    const query = queryTarget + expand + '&$orderby=Material';

    return context.read('/SAPAssetManager/Services/AssetManager.service', target, [], query).then(async function(results) {
        let itemArray = [];
        if (!libVal.evalIsEmpty(results)) {
            for (let row of results) {
                const queryBuilder = new QueryBuilder();
                const readLink = row['@odata.readLink'];
                const selectedItems = libCom.getStateVariable(context, 'SelectedRdyToPckItems');
                if (selectedItems?.length > 0 && sectionedTable.getSections()[0].getSelectedItemsCount() > 0) {
                    const matchingItem = selectedItems.find(item => item['@odata.readLink'] === readLink);
                    if (!matchingItem) {
                        continue;
                    }
                }
                // Extract the value pair            
                const valueInBrackets = readLink.substring(readLink.indexOf('(') + 2, readLink.lastIndexOf(')') - 1);
                const filter = `ObjectId eq '${valueInBrackets}'`;

                queryBuilder.addFilter(filter);
                queryBuilder.addExpandStatement(expand.substring('&$expand='.length));

                const material = [row.Material, row.MaterialName]
                    .filter((prop) => !!prop)
                    .join('- ');
               
                const item = {
                    properties: {
                        Title: material,
                        Description: row.DeliveryDocument,
                        QueryOptions: queryBuilder.build(),
                        EntitySet: target,
                    },
                };
                itemArray.push(item);
            }
        }
        libCom.setStateVariable(context, 'BulkUpdateItemCount', itemArray);
        return itemArray;
    });
}
