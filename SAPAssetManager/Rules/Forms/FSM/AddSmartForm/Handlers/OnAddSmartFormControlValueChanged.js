import ResetValidationOnInput from '../../../../Common/Validation/ResetValidationOnInput';
import AddSmartFormLibrary from '../AddSmartFormLibrary';

export default function OnAddSmartFormControlValueChanged(context) {
    ResetValidationOnInput(context);

    AddSmartFormLibrary.getResetButton(context).redraw(); // redraw reset button to trigger Enabled button rule
    AddSmartFormLibrary.setDoneActionBarButtonEnabled(context);
}
