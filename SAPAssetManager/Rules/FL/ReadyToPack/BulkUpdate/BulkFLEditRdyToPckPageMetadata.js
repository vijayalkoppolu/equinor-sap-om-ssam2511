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
            'FldLogsPackCtnRdyPcks',
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
            'HeaderName': 'LocationId',
            'PreferredWidth': config.ItemEDTColWidth.sloc,
        },
        {
            'HeaderName': 'ReceivingPoint',
            'PreferredWidth': config.ItemEDTColWidth.hdec,
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
                'Value': '{FldLogsShptLocationId}',
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
            'Type': 'ListPicker',
            'Name': 'ReceivingPointListPkr',
            'IsMandatory': true,
            'IsReadOnly': false,
            'Property': 'ReceivingPoint',
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
                'Caption': '$(L,receiving_point)',
                'Value': '{FldLogsVoyageDestStage}',
                'PickerItems': {
                    'DisplayValue': '{ShippingPoint} {ShippingPointText}',
                    'ReturnValue': '{ShippingPoint}',
                    'Target': {
                        'EntitySet': 'FldLogsShippingPoints',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': "$filter=Plant eq '{FldLogsDestPlnt}' &$orderby=ShippingPoint",
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
                'Action': '/SAPAssetManager/Rules/FL/ReadyToPack/BulkUpdate/BulkFLItemNav.js',
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
            'QueryOptions': '/SAPAssetManager/Rules/FL/ReadyToPack/BulkUpdate/BulkEditSearch.js',
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
            'QueryOptions': '/SAPAssetManager/Rules/FL/ReadyToPack/BulkUpdate/BulkEditSearch.js',
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}


