import GetResource from './GetResource';
import libCom from '../../Common/Library/CommonLibrary';
/**
 * Get the resource text for the given context.
 **/
export default function GetResourceText(context) {
    return GetResource(context).then((resource) => {
        libCom.setStateVariable(context, 'EWMResource', resource);
        return `${context.localizeText('resource')} : ${resource ? resource : context.localizeText('none')}`;
    });
}
