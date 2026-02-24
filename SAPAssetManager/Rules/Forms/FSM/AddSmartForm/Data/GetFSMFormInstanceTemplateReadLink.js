import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function GetFSMFormInstanceTemplateReadLink(context) {
    const template = AddSmartFormLibrary.getSelectedTemplate(context);
    return template['@odata.readLink'];
}
