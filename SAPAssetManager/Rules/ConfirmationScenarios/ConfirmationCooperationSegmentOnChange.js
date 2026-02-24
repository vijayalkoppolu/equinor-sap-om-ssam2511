import CooperationConfirmationNavWrapper from './CooperationConfirmationNavWrapper';
import DoubleCheckConfirmationNavWrapper from './DoubleCheckConfirmationNavWrapper';
import libCom from '../Common/Library/CommonLibrary';
import isAnotherTechnicianSelectEnabled from '../TimeSheets/CreateUpdate/IsAnotherTechnicianSelectEnabled';

/**
 * User has toggled the cooperation segment on the confirmation screen
 * Support button - scan another QR Code
 * None button - hide/show the responsible personnel field
 * @param {*} context 
 * @returns 
 */
export default function ConfirmationCooperationSegmentOnChange(context) {
    const value = libCom.getListPickerValue(context.getValue());
    const formCellContainerProxy = context.getPageProxy().getControl('FormCellContainer');

    if (value === 'Support') {
        formCellContainerProxy.getControl('ScenarioSeg').setValue('None', false); //Set to none temporarily in case user cancels scan
        return CooperationConfirmationNavWrapper(context);
    } else if (value === 'DoubleCheck') {
        formCellContainerProxy.getControl('ScenarioSeg').setValue('None', false); //Set to none temporarily in case user cancels scan
        return DoubleCheckConfirmationNavWrapper(context);
    } else if (value === 'None') {
        let enablePersonnel = isAnotherTechnicianSelectEnabled(context, true);
        const personnelControl = formCellContainerProxy.getControl('ResponsiblePersonnelNum');
        personnelControl.setVisible(enablePersonnel);
        if (enablePersonnel) {
            personnelControl.setEditable(true);
        }
    }
}
