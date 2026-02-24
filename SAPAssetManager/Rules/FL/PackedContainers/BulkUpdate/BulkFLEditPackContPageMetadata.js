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
        'DataSubscriptions': [
            'FldLogsContainerItems', 'FldLogsPackageItems',
        ],
        '_Type': 'Section.Type.Extension',
        '_Name': 'EditableDataTableExtensionSection1',
    };
}

export function GetEDTColumns(config) {
    let columns = [
        {
            'HeaderName': 'ItemSelection',
            'PreferredWidth': config.ItemEDTColWidth.switch,
        },
        {
            'HeaderName': 'ActualWeight',
            'PreferredWidth': config.ItemEDTColWidth.awght,
        },
        {
            'HeaderName': 'UOM',
            'PreferredWidth': config.ItemEDTColWidth.uom,
        },
        {
            'HeaderName': 'LocationId',
            'PreferredWidth': config.ItemEDTColWidth.loc,
        },
        {
            'HeaderName': 'DetailsButton',
            'PreferredWidth': config.ItemEDTColWidth.btn,
            'IsDynamicWidth': true,
        },
    ];
    return columns;
}

export function GetEDTItems() {
    let items =
        [{
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
            'Name': 'ActualWeight',
            'IsMandatory': false,
            'IsReadOnly': false,
            'Property': 'ActualWeight',
            'Parameters': {
                'Value': '/SAPAssetManager/Rules/FL/PackedContainers/BulkUpdate/GetActualWeight.js',
            },
        },
        {
            'Type': 'ListPicker',
            'Name': 'UOMListPicker',
            'IsMandatory': false,
            'IsReadOnly': false,
            'Property': 'UOM',
            'Parameters': {
                'Search': {
                    'Enabled': true,
                    'Delay': 500,
                    'MinimumCharacterThreshold': 3,
                    'Placeholder': '$(L,search)',
                    'BarcodeScanner': true,
                },
                'ItemsPerPage': 21,
                'CachedItemsToLoad': 2,
                'Caption': '$(L,uom)',
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
            'Name': 'LocationIdListPkr',
            'IsMandatory': false,
            'IsReadOnly': false,
            'Property': 'LocationId',
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
                'Caption': '$(L,location_id)',
                'Value': '{FldLogsShptLocationID}',
                'PickerItems': {
                    'DisplayValue': '{FldLogsShptLocationID}',
                    'ReturnValue': '{FldLogsShptLocationID}',
                    'Target': {
                        'EntitySet': 'FldLogsPackCtnLocIDs',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '$orderby=FldLogsShptLocationID',
                    },
                },
                'PickerPrompt': '$(L,select_single_item)',
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
                'Action': '/SAPAssetManager/Rules/FL/PackedContainers/BulkUpdate/BulkFLItemNav.js',
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
        'Search': {
            'Enabled': true,
            'Delay': 500,
            'MinimumCharacterThreshold': 3,
            'Placeholder': '$(L,search)',
            'BarcodeScanner': true,
        },
        'Extension': {
            '_Name': 'SelectAll',
            'Module': 'LabelButtonModule',
            'Control': 'LabelButtonExtension',
            'Class': 'LabelButtonClass',
            'Height': config.SelectAllHeight,
            'ExtensionProperties': {
                'Label': '/SAPAssetManager/Rules/FL/BulkUpdate/GetCaption.js',
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
            'QueryOptions': '/SAPAssetManager/Rules/FL/PackedContainers/BulkUpdate/BulkEditSearch.js',
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
            'Label': '/SAPAssetManager/Rules/FL/BulkUpdate/GetCaption.js',
            'Button': {
                'Title': '$(L, deselect_all)',
                'ToggleValue': true,
                'OnPress': '/SAPAssetManager/Rules/IssueOrReceipt/BulkUpdate/SelectDeselectAllBulkIssueOrReceiptItems.js',
            },
        },
        'Target': {
            'EntitySet': properties.EntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '/SAPAssetManager/Rules/FL/PackedContainers/BulkUpdate/BulkEditSearch.js',
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}


