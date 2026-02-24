import CommonLibrary from '../../../Common/Library/CommonLibrary';

/** @param {{getPageProxy(): IPageProxy & {binding: WCMDocumentItem}} & IClientAPI} context  */
export default function OperationalItemIsLocal(context) {
    const opItem = context.getPageProxy().binding;
    return !!CommonLibrary.isEntityLocal(opItem);
}
