import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function OnAddSmartFormPageLoaded(context) {
    AddSmartFormLibrary.updateSelectedTemplate(context);
    AddSmartFormLibrary.resetPageDefaultValues(context);
}
