import { GetEDTColumns, GetEDTItems, GetItemEDTSection, GetItemSearchAndSelectSection, GetItemTitleDescriptionSection } from './BulkFLWOPageMetadata';
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import QueryBuilder from '../../../Common/Query/QueryBuilder';
import SelectAllHeight from '../../../Inventory/IssueOrReceipt/BulkUpdate/SelectAllHeight';
import ItemHeaderHeight from '../../../Inventory/IssueOrReceipt/BulkUpdate/ItemHeaderHeight';
import EDTHeight, { FLEDTOrderColumnWidth } from '../../BulkUpdate/EDTConfigurations';
import EDTSoftInputModeConfig from '../../../Extensions/EDT/EDTSoftInputModeConfig';
export default function BulkFLEditPageMetadataGenerator(clientAPI) {
    EDTSoftInputModeConfig(clientAPI);
    let page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/FL/WorkOrders/EDT/FLBulkWOUpdate.page');
    const entitySet = libCom.getPageName(clientAPI) === 'FLWOResvItemsList' ? 'FldLogsWoResvItems' : 'FldLogsWoProducts';
    return GetItems(clientAPI,entitySet ).then((items) => {
        if (items) {
            addSections(clientAPI, page, items, entitySet );
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

function addSections(context, page, items, entitySet) {
    let config = GetConfigurations(context);
    config.totalItems = items.length;
    if (libCom.getStateVariable(context, 'BulkUpdateItem') === undefined) {
        libCom.setStateVariable(context, 'BulkUpdateItem', config.totalItems);
    }
    libCom.setStateVariable(context, 'BulkUpdateTotalItems', config.totalItems);

    const properties = {
        EntitySet: entitySet,
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
    config.ItemEDTColWidth = FLEDTOrderColumnWidth(context);
    return config;
}

async function GetItems(context,entitySet) {
    let query = '';
    let filters = '';
    if (entitySet === 'FldLogsWoResvItems') {
        query = `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoResvItem_Nav`;
        filters = "$filter=Status eq ''&$orderby=ReservationItem,Product";
    } else {
        query = `${context.getPageProxy().binding['@odata.readLink']}/FldLogsWoProduct_Nav`;
        filters = "$filter=Status eq ''&$orderby=Product";
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', query, [], filters).then(async function(results) {
        let itemArray = [];
        if (!libVal.evalIsEmpty(results)) {
            for (let row of results) {
                const queryBuilder = new QueryBuilder();
                const readLink = row['@odata.readLink'];
                const selectedItems = libCom.getStateVariable(context, 'SelectedFLWOItems');
                if (selectedItems?.length > 0 && context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectedItemsCount() > 0) {
                    const matchingItem = selectedItems.find(item => item['@odata.readLink'] === readLink);
                    if (!matchingItem) {
                        continue;
                    }
                }
                // Extract the key-value pairs
                const keyValuePairs = readLink.substring(readLink.indexOf('(') + 1, readLink.lastIndexOf(')'));
                // Split the key-value pairs and construct the filter string
                let filter = keyValuePairs.split(',').map(pair => {
                    const [key, value] = pair.split('=');
                    return `${key} eq ${value}`;
                }).join(' and ');
                queryBuilder.addFilter(filter);
                const serialized = row.IsSerialized ? context.localizeText('pi_serialized') : '';
                const itemDescription = [row.Operation, serialized]
                    .filter((prop) => !!prop)
                    .join(' - ');
                const item = {
                    properties: {
                        Title: entitySet === 'FldLogsWoResvItems'? `${row.ReservationItem}-${row.Product}` : row.Product,
                        Description: itemDescription,
                        QueryOptions: queryBuilder.build(),
                        EntitySet: entitySet,
                    },
                };
                itemArray.push(item);
            }
        }
        libCom.setStateVariable(context, 'BulkUpdateItemCount', itemArray);
        return itemArray;
    });
}
