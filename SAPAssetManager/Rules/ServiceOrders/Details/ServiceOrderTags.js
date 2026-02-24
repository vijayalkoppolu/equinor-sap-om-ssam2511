import S4ErrorsLibrary from '../../S4Errors/S4ErrorsLibrary';
import IsServiceOrderReleased from '../Status/IsServiceOrderReleased';

export default async function ServiceOrderTags(context) {
    const tags = [];

    if (S4ErrorsLibrary.isS4ObjectHasErrorsInBinding(context)) {
        tags.push({
            'Color': 'Red',
            'Text': '$(L,errors)',
            'Style': 'ErrorTag',
        }); 
    }

    const isOrderReleased = await IsServiceOrderReleased(context);
    if (!isOrderReleased) {
        tags.push({
            'Text': '$(L,not_released)',
        }); 
    }

    return tags;
}
