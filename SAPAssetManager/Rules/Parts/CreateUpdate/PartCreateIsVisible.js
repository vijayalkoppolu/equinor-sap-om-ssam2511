import libCom from '../../Common/Library/CommonLibrary';

export default function PartCreateIsVisible(context) {
    return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Edit') === 'Y' &&
        context.binding.ItemCategory !== libCom.getAppParam(context, 'PART', 'TextItemCategory');
}
