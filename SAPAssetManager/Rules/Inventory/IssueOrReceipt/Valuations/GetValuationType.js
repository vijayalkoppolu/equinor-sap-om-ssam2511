import ValuationsQuery from './ValuationsQuery';

export default function GetValuationType(context) {
    const current = context.binding?.ValuationType;
    return ValuationsQuery(context).then(data => {
        if (!data || !data.getItem || data.length === 0) {
            return '';
        }
        const available = new Set();
        for (let i = 0; i < data.length; i++) {
            available.add(data.getItem(i).ValuationType);
        }
        if (current && available.has(current)) {
            return current;
        }
        return data.getItem(0).ValuationType || '';
    }).catch(() => '');
}
