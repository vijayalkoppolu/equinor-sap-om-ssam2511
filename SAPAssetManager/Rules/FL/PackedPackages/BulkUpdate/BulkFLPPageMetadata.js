import deviceType from '../../../Common/DeviceType';


export function GetItemSearchAndSelectSection(context, config, properties) {
    if (deviceType(context) === 'Phone') {
        return GetItemSearchAndSelectSectionPhone(config, properties);
    }
    return GetItemSearchAndSelectSectionTablet(config, properties);
}

export function GetItemTitleDescriptionSection(context, config, properties) {
    if (deviceType(context) === 'Phone') {
        return GetItemTitleDescriptionSectionPhone(config, properties);
    }
    return GetItemTitleDescriptionSectionTablet(config, properties);
}

export function GetItemEDTSection(config, properties) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': true,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Module': 'extension-EditableDataTable',
        'Control': 'EditableDataTableViewExtension',
        'Class': 'EditableDataTableViewExtension',
        'Height': config.ItemEDTHeight,
        'ExtensionProperties': {
            'OnCellGetsFocus': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellGetsFocus.js',
            'OnCellLostFocus': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellLostFocus.js',
            'OnLoaded': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/BulkIssueOrReceiptCreateOnLoaded.js',
            'Configuration': {
                'IsStickyHeaderRow': true,
                'NumberOfLeadingStickyColumns': 0,
                'MaxLinesPerRow': 1,
                'IsHeaderRowVisible': false,
            },
            'Columns': properties.columns,
            'Row': {
                'Items': properties.items,
            },
            'Search': {
                'Enabled': true,
                'Delay': 500,
                'MinimumCharacterThreshold': 3,
                'Placeholder': '$(L,search)',
                'BarcodeScanner': true,
            },
            'Target': {
                'EntitySet': properties.EntitySet,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'QueryOptions': properties.QueryOptions,
            },
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'EditableDataTableExtensionSection1',
    };
}

export function GetEDTColumns(config) {
    let columns = [
        {
            'HeaderName': 'ItemSelection',
            'PreferredWidth': config.ItemFLEDTColWidth.switch,
        },
        {
            'HeaderName': 'ActWeight',
            'PreferredWidth': config.ItemFLEDTColWidth.actWght,
        },
        {
            'HeaderName': 'WeighttUOMLstPkr',
            'PreferredWidth': config.ItemFLEDTColWidth.weightUOM,
        },
        {
            'HeaderName': 'ReceivingPointLstPkr',
            'PreferredWidth': config.ItemFLEDTColWidth.recvPnt,
        },
        {
            'HeaderName': 'DetailsButton',
            'PreferredWidth': config.ItemFLEDTColWidth.btn,
            'IsDynamicWidth': true,
        },
    ];
    return columns;
}


export function GetEDTItems() {
    let items =
        [
            {
                'Type': 'Switch',
                'Name': 'ItemSelection',
                'IsMandatory': false,
                'IsReadOnly': false,
                'OnValueChange': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnSwitchValueChanged.js',
                'Property': 'ItemSelection',
                'Parameters': {
                    'Value': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptSwitchValue.js',
                },
            },
            {
                'Type': 'Number',
                'Name': 'ActWeight',
                'IsMandatory': true,
                'IsReadOnly': false,
                'Property': 'FldLogsCtnActualWeight',
                'Parameters': {
                    'Value': '/SAPAssetManager/Rules/FL/PackedPackages/BulkUpdate/BulkFLPActualWeightProperty.js',
                },
            },
            {
                'Type': 'ListPicker',
                'Name': 'WeighttUOMLstPkr',
                'IsMandatory': true,
                'IsReadOnly': false,
                'Property': 'FldLogsCtnActualWeightUnit',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 1,
                        'Placeholder': '$(L,search)',
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 21,
                    'CachedItemsToLoad': 2,
                    'Caption': '$(L,fld_receiving_point)',
                    'Value': '{FldLogsCtnActualWeightUnit}',
                    'PickerItems': {
                        'DisplayValue': '{UnitOfMeasure}',
                        'ReturnValue': '{UnitOfMeasure}',
                        'Target': {
                            'EntitySet': 'FldLogsPackCtnActWgtUOMs',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '$orderby=UnitOfMeasure',
                        },
                    },
                },
            },
            {
                'Type': 'ListPicker',
                'Name': 'ReceivingPointLstPkr',
                'IsMandatory': true,
                'IsReadOnly': false,
                'Property': 'FldLogsVoyageDestStage',
                'Parameters': {
                    'Search': {
                        'Enabled': true,
                        'Delay': 500,
                        'MinimumCharacterThreshold': 1,
                        'Placeholder': '$(L,search)',
                        'BarcodeScanner': true,
                    },
                    'ItemsPerPage': 12,
                    'CachedItemsToLoad': 2,
                    'Caption': '$(L,fld_receiving_point)',
                    'Value': '{FldLogsVoyageDestStage}',
                    'PickerItems': {
                        'DisplayValue': '{ShippingPointText}',
                        'ReturnValue': '{ShippingPoint}',
                        'Target': {
                            'EntitySet': 'FldLogsShippingPoints',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                            'QueryOptions': '/SAPAssetManager/Rules/FL/PackedPackages/BulkUpdate/RecvgListPickerQueryOptions.js',
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
                    'Icon': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/ShowAccessoryButtonIcon.js',
                    'Action': '/SAPAssetManager/Rules/FL/PackedPackages/BulkUpdate/BulkFLPPKGEditNav.js',
                    'Style': 'Secondary',
                },
            },
        ];
    return items;
}


function GetItemTitleDescriptionSectionPhone(config, properties) {
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
            'Height': config.ItemHeaderHeight,
            'ExtensionProperties': {
                'Title': properties.Title,
                'Description': properties.Description,
            },
            'OnPress': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/EDT/BulkIssueOrReceiptOnCellLostFocus.js',
        },
        'Target': {
            'EntitySet': properties.EntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$top=1',
        },
        '_Type': 'Section.Type.ObjectCollection',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}

function GetItemTitleDescriptionSectionTablet(config, properties) {
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
        'Height': config.ItemHeaderHeight,
        'ExtensionProperties': {
            'Title': properties.Title,
            'Description': properties.Description,
        },
        'Target': {
            'EntitySet': properties.EntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$top=1',
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}

function GetItemSearchAndSelectSectionPhone(config, properties) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': true,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        '_Type': 'Section.Type.ObjectCollection',
        'Layout': {
            'NumberOfColumns': 1,
        },
        'Extension': {
            '_Name': 'SelectAll',
            'Module': 'LabelButtonModule',
            'Control': 'LabelButtonExtension',
            'Class': 'LabelButtonClass',
            'Height': config.SelectAllHeight,
            'ExtensionProperties': {
                'Label': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/GetAllCaption.js',
                'Button': {
                    'Title': '$(L, deselect_all)',
                    'ToggleValue': true,
                    'OnPress': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/SelectDeselectAllBulkIssueOrReceiptItems.js',
                },
                
            },
        },
        'Target': {
            'EntitySet': properties.EntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$top=1',
        },
    };
}

function GetItemSearchAndSelectSectionTablet(config, properties) {
    return {
        'Header': {
            'UseTopPadding': false,
        },
        'Footer': {
            'UseBottomPadding': false,
        },
        'Separators': {
            'TopSectionSeparator': false,
            'BottomSectionSeparator': true,
            'HeaderSeparator': false,
            'FooterSeparator': false,
            'ControlSeparator': false,
        },
        'Module': 'LabelButtonModule',
        'Control': 'LabelButtonExtension',
        'Class': 'LabelButtonClass',
        'Height': config.SelectAllHeight,
        'ExtensionProperties': {
            'Label': '/SAPAssetManager/Rules/Inventory/IssueOrReceipt/BulkUpdate/GetAllCaption.js',
            'Button': {
                    'Title': '$(L, deselect_all)',
                    'ToggleValue': true,
                    'OnPress': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/SelectDeselectAllBulkIssueOrReceiptItems.js',
                },
            
        },
        'Target': {
            'EntitySet': properties.EntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '$top=1',
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}
