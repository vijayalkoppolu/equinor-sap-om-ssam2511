import IsFSMS4SectionVisible from '../../ServiceOrders/IsFSMS4SectionVisible';
import ObjectCardButtonTitle from './ObjectCardButtonTitle';

export default function ObjectCardSecondaryButtonTitle(context) {
    if (IsFSMS4SectionVisible(context)) {
        return ObjectCardButtonTitle(context, ['S', 'N'], true).then(items => {
            const itemToDisplay = items.length > 1 ?
                items.find(title => title.TransitionType === 'N') :
                items[0];
            return itemToDisplay?.Title;
        });
    }

    return ObjectCardButtonTitle(context, ['S', 'N']);
}
