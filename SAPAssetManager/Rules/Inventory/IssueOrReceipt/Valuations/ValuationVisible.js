import ValuationsQuery from './ValuationsQuery';

export default function ValuationVisible(context) {
    return ValuationsQuery(context).then(data => {
        return data && data.length > 0;
    }).catch(() => false);
}
