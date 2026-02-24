import Logger from '../../../Log/Logger';
import ValuationsQuery from './ValuationsQuery';

export default function ValuationPickerItems(context) {
    return ValuationsQuery(context).then(data => {
        const items = [];
        const seen = new Set();
        if (data?.getItem) {
            for (let i = 0; i < data.length; i++) {
                const vt = data.getItem(i)?.ValuationType;
                if (vt && !seen.has(vt)) {
                    seen.add(vt);
                    items.push({ ReturnValue: vt, DisplayValue: vt });
                }
            }
        }
        return items;
    }).catch((error) => {
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/Inventory/CategoryValuation.global').getValue(),`ValuationPickerItems(context) error: ${error}`);
        return [];
    });
}
