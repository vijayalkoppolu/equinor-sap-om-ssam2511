import deviceType from '../../Common/DeviceType';

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
            'OnLoaded': '/SAPAssetManager/Rules/FL/BulkUpdate/BulkFLUpdateValidate.js',
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
            'FldLogsContainerItems','FldLogsPackageItems',
        ],
        '_Type': 'Section.Type.Extension',
        '_Name': 'EditableDataTableExtensionSection1',
    };
}

export function GetEDTColumns(config) {
    let columns = [
        {
            'HeaderName': 'StorageLocation',
            'PreferredWidth': config.ItemEDTColWidth.sloc,		
        },
        {
            'HeaderName': 'HandlingDecision',
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
    [
        {
            'Type': 'ListPicker',
            'Name': 'StorageLocation',
            'IsMandatory': true,
            'IsReadOnly': false,
            'Property': 'StorageLocation',
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
                'Caption': '$(L,storage_location)',
                'Value': '{DestStorLocID}',
                'PickerItems': {
                    'DisplayValue': '{StorageLocation} - {StorageLocationDesc}',
                    'ReturnValue': '{StorageLocation}',
                    'Target': {
                        'EntitySet': 'StorageLocations',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '/SAPAssetManager/Rules/Inventory/Fetch/StorageLocationQueryOptions.js',
                    },
                },
            },
        }, 
        {
            'Type': 'ListPicker',
            'Name': 'HandlingDecision',
            'IsMandatory': true,
            'IsReadOnly': false,
            'Property': 'HandlingDecision',
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
                'Caption': '$(L,handling_decision)',
                'Value': '/SAPAssetManager/Rules/FL/BulkUpdate/GetHandlingDecisionDescription.js',
                'PickerItems': { 
                'DisplayValue': '{Description}',
                'ReturnValue': '{HandlingDecision}',
                'Target': {
                        'EntitySet': 'FldLogsHandlingDecisions',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'QueryOptions': '/SAPAssetManager/Rules/FL/BulkUpdate/HandlingDecisionQueryOptions.js',
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
                'Action': '/SAPAssetManager/Rules/FL/BulkUpdate/EditFLItemNav.js',
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
            },
        },
        'Target': {
            'EntitySet': properties.EntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '/SAPAssetManager/Rules/FL/BulkUpdate/BulkEditSearch.js',
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
        },
        'Target': {
            'EntitySet': properties.EntitySet,
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '/SAPAssetManager/Rules/FL/BulkUpdate/BulkEditSearch.js',
        },
        '_Type': 'Section.Type.Extension',
        '_Name': 'HeaderDescriptionExtensionSection',
    };
}


