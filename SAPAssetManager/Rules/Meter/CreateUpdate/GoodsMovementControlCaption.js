import MeterCreateUpdateGoodsMovement from './MeterCreateUpdateGoodsMovement';

/**
 * Returns the caption for a control, adding an asterisk if a default movement type exists.
 * The control name is determined from context.getName().
 *
 * @param {IClientAPI} context
 * @returns {string}
 */
export default function GoodsMovementControlCaption(context) {
    const captions = {
        ReceivingPlantLstPkr: 'receiving_plant',
        StorageLocationLstPkr: 'storage_location',
    };
    const name = context.getName();
    let caption = captions[name] ? context.localizeText(captions[name]) : '';
    if (MeterCreateUpdateGoodsMovement(context)) {
        caption += '*';
    }
    return caption;
}
