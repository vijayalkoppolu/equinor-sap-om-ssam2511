import { GetEDTColumns, GetEDTItems, GetItemEDTSection, GetItemSearchAndSelectSection, GetItemTitleDescriptionSection } from './BulkFLIssueOrReceiptPageMetadata';
import { GetOpenItemsTargetQuery, HeaderToItemsEntitySetName } from './BulkUpdateLibrary';
import GetMaterialDescription from '../Common/GetMaterialDescription';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import SelectAllHeight from '../../Inventory/IssueOrReceipt/BulkUpdate/SelectAllHeight';
import ItemHeaderHeight from '../../Inventory/IssueOrReceipt/BulkUpdate/ItemHeaderHeight';
import EDTColumnWidth from './EDTConfigurations';
import EDTHeight from '../../Inventory/IssueOrReceipt/BulkUpdate/EDTConfigurations';
import EDTSoftInputModeConfig from '../../Extensions/EDT/EDTSoftInputModeConfig';
export default function BulkFLEditPageMetadataGenerator(clientAPI) {
    EDTSoftInputModeConfig(clientAPI);
    let page = clientAPI.getPageProxy().getPageDefinition('/SAPAssetManager/Pages/FL/Edit/BulkUpdate.page');
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
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const properties = {
        EntitySet: HeaderToItemsEntitySetName[type],
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
    config.ItemEDTColWidth = EDTColumnWidth(context);
    return config;
}

async function GetItems(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const queryTarget = GetOpenItemsTargetQuery(type, context.binding);
    const target = queryTarget.target;
    const expand = '&$expand=FldLogsContainerItemStatus_Nav,FldLogsHandlingDecision_Nav,FldLogsPackagingType_Nav,FldLogsVisualInspection_Nav';
    const query = queryTarget.query + expand;

    return context.read('/SAPAssetManager/Services/AssetManager.service', target, [], query).then(async function(results) {
        let itemArray = [];
        if (!libVal.evalIsEmpty(results)) {
            for (let row of results) {
                const queryBuilder = new QueryBuilder();
                const readLink = row['@odata.readLink'];
                const selectedItems = libCom.getStateVariable(context, 'SelectedContainerItems');
                if (selectedItems?.length > 0 && context.getPageProxy().getControl('SectionedTable').getSections()[0].getSelectedItemsCount() > 0) {
                    const matchingItem = selectedItems.find(item => item['@odata.readLink'] === readLink);
                    if (!matchingItem) {
                        continue;
                    }
                }
                // Extract the key-value pairs
                const keyValuePairs = readLink.substring(readLink.indexOf('(') + 1, readLink.lastIndexOf(')'));
                // Split the key-value pairs and construct the filter string
                const filter = keyValuePairs.split(',').map(pair => {
                    const [key, value] = pair.split('=');
                    return `${key} eq ${value}`;
                }).join(' and ');

                queryBuilder.addFilter(filter);
                queryBuilder.addExpandStatement(expand.substring('&$expand='.length));

                const itemDescription = [row.ReferenceDocNumber, row.HandlingUnitID]
                    .filter((prop) => !!prop)
                    .join(', ');
                const item = {
                    properties: {
                        Title: await GetMaterialDescription(context, row),
                        Description: itemDescription,
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
