import libCom from '../../../Common/Library/CommonLibrary';

export default function WHEditAllCaption(context) {
    let entryPoint = libCom.getStateVariable(context,'EditAllEntryPoint');
    if (entryPoint === 'GoodsReceipt') {
        return context.localizeText('post_goods_receipt');
    } else {
        return context.localizeText('ewm_edit_all_items');
    }
}
