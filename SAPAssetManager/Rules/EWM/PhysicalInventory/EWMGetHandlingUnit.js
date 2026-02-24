export default function EWMGetHandlingUnit(context) {
    const binding = context.binding;
    const handlingunit = binding?.HandlingUnit;
    if (handlingunit) {
        if (binding.HUComplCntd === 'X') {
            return [handlingunit, context.localizeText('completed')].join(' - ');
        } else if (binding.HUEmpty === 'X') {
            return [handlingunit, context.localizeText('empty')].join(' - ');
        } else if (binding.NoHU === 'X') {
            return [handlingunit, context.localizeText('missing')].join(' - ');
        } else {
            return handlingunit;
        }
    }
    return '-';
}
