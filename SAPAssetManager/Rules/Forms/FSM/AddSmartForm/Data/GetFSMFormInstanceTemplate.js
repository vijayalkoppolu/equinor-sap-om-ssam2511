import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function GetFSMFormInstanceTemplate(context) {
    const template = AddSmartFormLibrary.getSelectedTemplate(context);
    return template?.Id || '';
}
