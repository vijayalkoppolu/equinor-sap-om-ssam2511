import {WorkOrderControlsLibrary as LibWoControls} from '../WorkOrderLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default function WorkOrderTechObjectID(context) {

    if (ValidationLibrary.evalIsNotEmpty(LibWoControls.getEquipmentValue(context))) {
        return LibWoControls.getEquipmentValue(context);
    } else if (ValidationLibrary.evalIsNotEmpty(LibWoControls.getFunctionalLocationValue(context))) {
        return LibWoControls.getFunctionalLocationValue(context);
    }
    return '';
}
