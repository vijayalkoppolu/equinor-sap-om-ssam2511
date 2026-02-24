import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function IsItemFieldEditable(context) {
    const previousPageProxy = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
    const parentPageName = CommonLibrary.getPageName(previousPageProxy);
    return parentPageName === 'ServiceItemDetailsPage' || parentPageName === 'ServiceItemDetailsClassicPage';
}
