import WHInboundDeliveryItemProductAndDesc from '../WHInboundDeliveryItemProductAndDesc';
import WHInboundDeliveryBatchAndSer from '../WHInboundDeliveryItemBatchAndSer';
import EDTHeight from '../../../../Inventory/IssueOrReceipt/BulkUpdate/EDTConfigurations';
import DeviceType from '../../../../Common/DeviceType';
import IsIOS from '../../../../Common/IsIOS';

export default function WHHandlingUnitMixedCreatePageMetadata(context) {
    const page = context.getPageDefinition('/SAPAssetManager/Pages/EWM/Inbound/HandlingUnit/WHHandlingUnitMixedCreate.page');
    const sections = page.Controls[0].Sections;
    const items = context.getActionBinding().items;

    const tableHeight = EDTHeight(context);
    const columnsWidth = generateColumnsWidth(context);

    context.getActionBinding().items.forEach((item, idx) => {
        const isFirstItem = idx === 0;

        sections.push({
            '_Type': 'Section.Type.ObjectTable',
            'Header': {
                'Caption': isFirstItem ? context.localizeText('items_x', [items.length]) : null,
                'UseTopPadding': isFirstItem,
            },
            'ObjectCells': [
                {
                    'ObjectCell': {
                        'Title': WHInboundDeliveryItemProductAndDesc({ binding: item }),
                        'Subhead': WHInboundDeliveryBatchAndSer({ binding: item, localizeText: context.localizeText }),
                        'Footnote': context.localizeText('open_packable_quantity_x', [item.OpenPackableQuantity]),
                        'PreserveIconStackSpacing': false,
                    },
                },
            ],
            'Footer': {
                'UseBottomPadding': false,
            },
            'Separators': {
                'TopSectionSeparator': !isFirstItem,
            },
        });

        sections.push({
            '_Type': 'Section.Type.Extension',
            '_Name': 'EditableDataTableExtensionSection',
            'Module': 'extension-EditableDataTable',
            'Control': 'EditableDataTableViewExtension',
            'Class': 'EditableDataTableViewExtension',
            'Height': tableHeight,
            'Header': {
                'UseTopPadding': false,
            },
            'Footer': {
                'UseBottomPadding': false,
            },
            'ExtensionProperties': {
                'Configuration': {
                    'IsStickyHeaderRow': false,
                    'IsHeaderRowVisible': false,
                    'IsSelectionModeEnabled': false,
                    'IsSelectionColumnAlwaysVisible': false,
                    'IsCellBackgroundClear': true,
                    'IsValueChangeOnCellEdit': true,
                    'IsSortingIconVisible': false,
                    'NumberOfLeadingStickyColumns': 0,
                    'MaxLinesPerRow': 1,
                },
                'Columns': [
                    {
                        'HeaderName': '',
                        'PreferredWidth': columnsWidth.label,
                    },
                    {
                        'HeaderName': '',
                        'PreferredWidth': columnsWidth.qty,
                    },
                    {
                        'HeaderName': '',
                        'PreferredWidth': columnsWidth.uom,
                    },
                ],
                'Row': {
                    'Items': [
                        {
                            'Type': 'Text',
                            'Name': 'StaticColumn',
                            'IsMandatory': false,
                            'IsReadOnly': true,
                            'OnValueChange': '',
                            'Parameters': {
                                'Value': context.localizeText('quantity_to_pack_column_label'),
                            },
                        },
                        {
                            'Type': 'Number',
                            'Name': 'Quantity',
                            'IsMandatory': true,
                            'IsReadOnly': false,
                            'Property': 'qty',
                            'OnValueChange': '/SAPAssetManager/Rules/EWM/Inbound/Items/HandlingUnit/WHHandlingUnitSpecifyQtyChange.js',
                            'Parameters': {
                                'Value': item.OpenPackableQuantity,
                            },
                        },
                        {
                            'Type': 'Text',
                            'Name': 'UOM',
                            'IsMandatory': false,
                            'IsReadOnly': true,
                            'Property': 'uom',
                            'OnValueChange': '',
                            'Parameters': {
                                'Value': item.UnitofMeasure,
                            },
                        },
                    ],
                },
                'Target': {
                    'EntitySet': 'WarehouseInboundDeliveryItems',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'QueryOptions': `$filter=DocumentID eq '${item.DocumentID}' and ItemID eq '${item.ItemID}'`,
                },
            },
        });

    });

    return page;
}

function generateColumnsWidth(context) {
    const isPhone = DeviceType(context) === 'Phone';

    if (IsIOS(context)) {
        return {
            label: isPhone ? 130 : 220,
            qty: isPhone ? 140 : 220,
            uom: isPhone ? 70 : 90,
        };
    } else {
        return {
            label: isPhone ? 175 : 220,
            qty: isPhone ? 175 : 220,
            uom: isPhone ? 90 : 90,
        };
    }
}
