import IsIOS from '../../../../Common/IsIOS';
import DeviceType from '../../../../Common/DeviceType';

export default function WHHandlingUnitCreateSpecifyQuantityTableContent(context) {
    const items = context.binding.items || [];
    
    // Prepare arrays for each column's cells
    const numberCells = [];
    const qtyCells = [];
    const uomCells = [];
    const huNumberCells = [];
    const buttonCells = [];

    const columnsWidth = generateColumnsWidth(context);

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        numberCells.push({
            Type: 'Text',
            IsMandatory: false,
            IsReadOnly: true,
            Parameters: { Value: `${i + 1}.` },
        });
        qtyCells.push({
            Type: 'Number',
            IsMandatory: true,
            IsReadOnly: false,
            Property: 'qty',
            OnValueChange: '/SAPAssetManager/Rules/EWM/Inbound/Items/HandlingUnit/WHHandlingUnitSpecifyQtyChange.js',
            Parameters: { Value: item.qty },
        });
        uomCells.push({
            Type: 'Text',
            IsMandatory: false,
            IsReadOnly: true,
            Property: 'uom',
            Parameters: { Value: item.uom },
        });
        huNumberCells.push({
            Type: 'Text',
            IsMandatory: false,
            IsReadOnly: false,
            Property: 'number',
            OnValueChange: '/SAPAssetManager/Rules/EWM/Inbound/Items/HandlingUnit/WHHandlingUnitNumberChange.js',
            Parameters: { Value: item.number || '' },
        });
        buttonCells.push({
            Type: 'Button',
            IsMandatory: false,
            IsReadOnly: false,
            Parameters: {
                Value: 'Scan',
                Action: '/SAPAssetManager/Rules/EWM/Inbound/Items/HandlingUnit/WHHandlingUnitNumberScan.js',
                Style: 'Secondary',
            },
        });
    }

    return {
        Columns: [
            { HeaderName: '#', PreferredWidth: columnsWidth.number, Cells: numberCells },
            { HeaderName: context.localizeText('qty_short'), PreferredWidth: columnsWidth.qty, Cells: qtyCells },
            { HeaderName: context.localizeText('uom'), PreferredWidth: columnsWidth.uom, Cells: uomCells },
            { HeaderName: context.localizeText('ewm_hu_number'), PreferredWidth: columnsWidth.huNumber, Cells: huNumberCells },
            { HeaderName: '', PreferredWidth: columnsWidth.button, Cells: buttonCells },
        ],
        RowBindings: items,
    };
}

function generateColumnsWidth(context) {
    const isPhone = DeviceType(context) === 'Phone';

    if (IsIOS(context)) {
        return {
            number: isPhone ? 40 : 60,
            qty: 90,
            uom: isPhone ? 70 : 80,
            huNumber: isPhone ? 110 : 200,
            button: isPhone ? 70 : 100,
        };
    } else {
        return {
            number: isPhone ? 60 : 80,
            qty: isPhone ? 70 : 100,
            uom: isPhone ? 90 : 110,
            huNumber: isPhone ? 120 : 170,
            button: isPhone ? 100 : 120,
        };
    }
}
