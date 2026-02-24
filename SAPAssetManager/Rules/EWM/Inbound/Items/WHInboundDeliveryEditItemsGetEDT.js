import deviceType from '../../../Common/DeviceType';


export default function WHInboundDeliveryEditItemsGetEDT(height, queryOptions) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': true,
            'BottomSectionSeparator': true,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Module': 'extension-EditableDataTable',
        'Control': 'EditableDataTableViewExtension',
        'Class': 'EditableDataTableViewExtension',
        'Height': height,
        'ExtensionProperties': {
            'OnCellGetsFocus': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellGetsFocus.js',
            'OnCellLostFocus': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellLostFocus.js',
            'OnLoaded': '',
            'Configuration': {
                'IsStickyHeaderRow': true,
                'NumberOfLeadingStickyColumns': 0,
                'MaxLinesPerRow': 1,
                'IsHeaderRowVisible': false,
            },
            'Target': {
                'EntitySet': 'WarehouseInboundDeliveryItems',
                'QueryOptions': queryOptions,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
            'Columns': [
                {
                    'HeaderName': '',
                    'PreferredWidth': 100,
                },
                {
                    'HeaderName': '',
                    'PreferredWidth': 100,
                },
                {
                    'HeaderName': '',
                    'PreferredWidth': 100,
                },
                {
                    'HeaderName': '',
                    'PreferredWidth': 100,
                    'IsDynamicWidth': true,
                },
            ],
            'Row': {
                'Items': [
                    {
                        'Name': 'Quantity',
                        'Type': 'Number',
                        'IsReadOnly': '/SAPAssetManager/Rules/EWM/Inbound/Items/WHInboundDeliveryItemEDTQuantityIsEditable.js',
                        'OnValueChange': '/SAPAssetManager/Rules/EWM/Inbound/Items/WHInboundDeliveryItemQuantityFieldChanged.js',
                        'Property': 'Quantity',
                        'IsMandatory': false,
                        'Parameters': {
                            'Value': '/SAPAssetManager/Rules/EWM/Inbound/Items/WHInboundDeliveryItemGetQuantity.js',
                        },
                    },
                    {
                        'Name': 'UOM',
                        'Type': 'ListPicker',
                        'IsReadOnly': false,
                        'OnValueChange': '/SAPAssetManager/Rules/EWM/Inbound/Items/WHInboundDeliveryItemUOMFieldChanged.js',
                        'IsMandatory': false,
                        'Parameters': {
                            'Search': {
                                'Enabled': true,
                                'Delay': 500,
                                'MinimumCharacterThreshold': 3,
                                'Placeholder': '$(L,search)',
                                'BarcodeScanner': false,
                            },
                            'ItemsPerPage': 50,
                            'CachedItemsToLoad': 20,
                            'Caption': '$(L, uom)',
                            'Value': '{UnitofMeasure}',
                            'DisplayValue': '{UnitofMeasure}',
                            'PickerItems': {
                                'DisplayValue': '{UoM}',
                                'ReturnValue': '{UoM}',
                                'Target': {
                                    'EntitySet': 'WarehouseProductUoMs',
                                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                                    'QueryOptions': '$select=UoM&$apply=groupby((UoM))',
                                },
                            },
                        },
                    },
                    {
                        'Name': 'StockType',
                        'Type': 'ListPicker',
                        'IsReadOnly': false,
                        'OnValueChange': '/SAPAssetManager/Rules/EWM/Inbound/Items/WHInboundDeliveryItemStockTypeFieldChanged.js',
                        'IsMandatory': false,
                        'Parameters': {
                            'Search': {
                                'Enabled': true,
                                'Delay': 500,
                                'MinimumCharacterThreshold': 3,
                                'Placeholder': '$(L,search)',
                                'BarcodeScanner': false,
                            },
                            'ItemsPerPage': 50,
                            'CachedItemsToLoad': 20,
                            'Caption': '$(L, stock_type)',
                            'Value': '{StockType}',
                            'DisplayValue': '{StockType}',
                            'PickerItems': {
                                'DisplayValue': '{StockType}',
                                'ReturnValue': '{StockType}',
                                'Target': {
                                    'EntitySet': 'WarehouseStockTypes',
                                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                                    'QueryOptions': '$select=StockType&$apply=groupby((StockType))',
                                },
                            },
                        },
                    },
                    {
                        'Type': 'Button',
                        'Name': 'DetailsButton',
                        'IsMandatory': false,
                        'IsReadOnly': false,
                        'OnValueChange': '',
                        'Property': 'DetailsPageButton',
                        'Parameters': {
                            'Icon': '/SAPAssetManager/Rules/EWM/Inbound/Items/ShowAccessoryButtonIcon.js',
                            'Action': '/SAPAssetManager/Rules/EWM/Inbound/EDTNavigateToSingleEditItem.js',
                            'Style': 'Secondary',
                        },
                    },
                ],
            },
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'EditableDataTableExtensionSection',
    };
}

export function WHInboundDeliveryEditItemsGetSectionHeader(context, height, title, description, queryOptions) {
    if (deviceType(context) === 'Phone') {
        return GetItemTitleDescriptionSectionPhone(height, title, description, queryOptions);
    }
    return GetItemTitleDescriptionSectionTablet(height, title, description, queryOptions);
}

function GetItemTitleDescriptionSectionPhone(height, title, description, queryOptions) {
    return { 
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': false,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Layout': {
            'NumberOfColumns': 1,
        },
        'Extension': {
            'Module': 'HeaderDescriptionModule',
            'Control': 'HeaderDescriptionExtension',
            'Class': 'HeaderDescriptionClass',
            'Height': height,
            'ExtensionProperties': {
                'Title': title,
                'Description': description,
            },
            'OnPress': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellLostFocus.js',
        },
        'Target': {
            'EntitySet': 'WarehouseInboundDeliveryItems',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': queryOptions,
        },
        '_Type': 'Section.Type.ObjectCollection',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}

function GetItemTitleDescriptionSectionTablet(height, title, description, queryOptions) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': false,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Module': 'HeaderDescriptionModule',
        'Control': 'HeaderDescriptionExtension',
        'Class': 'HeaderDescriptionClass',
        'Height': height,
        'ExtensionProperties': {
            'Title': title,
            'Description': description,
        },
        'Target': {
            'EntitySet': 'WarehouseInboundDeliveryItems',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': queryOptions,
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}
