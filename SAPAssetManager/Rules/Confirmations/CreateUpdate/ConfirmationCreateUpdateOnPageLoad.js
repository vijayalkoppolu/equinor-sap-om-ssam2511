import style from '../../Common/Style/StyleFormCellButton';
import libCom from '../../Common/Library/CommonLibrary';
import Stylizer from '../../Common/Style/Stylizer';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import LaborTimeMinuteInterval from '../CreateUpdate/LaborTimeMinuteInterval';
import ODataDate from '../../Common/Date/ODataDate';
import onUpdate from '../../Confirmations/CreateUpdate/IsOnUpdate';
import activityTypeDefault from '../CreateUpdate/ActivityTypeDefault';
import libConfirm from '../../ConfirmationScenarios/ConfirmationScenariosLibrary';
import ConfirmationScenariosFeatureIsEnabled from '../../ConfirmationScenarios/ConfirmationScenariosFeatureIsEnabled';
import Logger from '../../Log/Logger';

export default async function ConfirmationCreateUpdateOnPageLoad(context) {
    hideCancel(context);
    let stylizer = new Stylizer(['GrayText']);
    const formCellContainerProxy = context.getControl('FormCellContainer');
    if (!context.getBindingObject().IsOnCreate) {
        style(context, 'DiscardButton');
    }

    if (!context.getBindingObject().IsWorkOrderChangable) {
        let woPicker = formCellContainerProxy.getControl('WorkOrderLstPkr');
        stylizer.apply(woPicker, 'Value');

        if (onUpdate(context)) { //Only do this during edit, or MDK puts the wrong caption on the last screen field
            let confirmationId = formCellContainerProxy.getControl('ConfirmationIdProperty');
            stylizer.apply(confirmationId, 'Value');
        }

        if (!context.getBindingObject().IsOperationChangable) {
            let opPicker = formCellContainerProxy.getControl('OperationPkr');
            stylizer.apply(opPicker, 'Value');
            if (!context.getBindingObject().IsSubOperationChangable) {
                let subOpPicker = formCellContainerProxy.getControl('SubOperationPkr');
                stylizer.apply(subOpPicker, 'Value');
            }
        }
    }

    await returnLaborTimeMinuteInterval(context, formCellContainerProxy);
    return await confirmationScenarioSetup(context);
}

function returnLaborTimeMinuteInterval(context, formCellContainerProxy) {
    return LaborTimeMinuteInterval(context, context.getBindingObject().OrderID, context.getBindingObject().Operation, context.getBindingObject().Operation).then(duration => { //Handle clock in/out processing if necessary
        let durationControl = formCellContainerProxy.getControl('DurationPkr');
        durationControl.setValue(duration);

        if (context.getBindingObject().IsOnCreate) {
            let startDateTime;
            if (libCom.isDefined(context.getBindingObject().PostingDate)) {
                startDateTime = new ODataDate(context.getBindingObject().PostingDate);
                Logger.info('FCTCLog', 'FCTCLog - TIMESHEET  <returnLaborTimeMinuteInterval>  posting date ' + startDateTime.toLocalDateTimeString());
            } else {
                startDateTime = new ODataDate();
                Logger.info('FCTCLog', 'FCTCLog - TIMESHEET  <returnLaborTimeMinuteInterval> NO posting date');
            }

            startDateTime.date().setMinutes(startDateTime.date().getMinutes() - duration);

            let startDateControl = formCellContainerProxy.getControl('StartDatePicker');
            startDateControl.setValue(startDateTime.date());

            let startTimeControl = formCellContainerProxy.getControl('StartTimePicker');
            startTimeControl.setValue(startDateTime.date());
            Logger.info('FCTCLog', 'FCTCLog - TIMESHEET  <returnLaborTimeMinuteInterval> StartDateTime ' + startDateTime.toLocalDateTimeString());
        }

        //Set initial control values from binding
        let woControl = formCellContainerProxy.getControl('WorkOrderLstPkr');
        let opControl = formCellContainerProxy.getControl('OperationPkr');
        let subControl = formCellContainerProxy.getControl('SubOperationPkr');
        let actControl = formCellContainerProxy.getControl('ActivityTypePkr');
        let indicatorControl = formCellContainerProxy.getControl('AcctIndicatorPkr');

        if (context.getBindingObject().OrderID) {
            woControl.setValue(context.getBindingObject().OrderID);
        }

        if (context.getBindingObject().Operation) {
            opControl.setValue(context.getBindingObject().Operation);
        }

        if (context.getBindingObject().SubOperation) {
            subControl.setValue(context.getBindingObject().SubOperation);
        }

        if (context.getBindingObject().AccountingIndicator) {
            indicatorControl.setValue(context.getBindingObject().AccountingIndicator);
        }

        if (context.getBindingObject().ActivityType) {
            actControl.setValue(context.getBindingObject().ActivityType);
        } else {
            actControl.setValue(activityTypeDefault(context));
        }

        libCom.saveInitialValues(context);
        return true;
    });
}

/**
 * Default the confirmation scenario fields if they exist in the binding object
 * @param {*} context
 * @param {*} formCellContainerProxy 
 */
export async function confirmationScenarioSetup(context, params) {
    let binding;
    const screen = context.getControl('FormCellContainer');

    if (ConfirmationScenariosFeatureIsEnabled(context)) {
        if (params) {
            binding = params;
        } else {
            binding = context.getBindingObject();
        }

        if (binding.ConfirmationScenarioPersonnelNumber) {
            screen.getControl('ResponsiblePersonnelNum').setValue(binding.ConfirmationScenarioPersonnelNumber);
            screen.getControl('ResponsiblePersonnelNum').setVisible(true);
        }

        if (binding.ConfirmationScenarioNote) {
            binding.ConfirmationScenarioNote = binding.ConfirmationScenarioNote.replace(/\\'/g, "'"); //Unescape the note
            screen.getControl('DescriptionNote').setValue(binding.ConfirmationScenarioNote);
        }

        await finalizeConfirmationScenarioFields(context, binding);
    }
}

/**
 * If this is a scenario confirmation, then set the segment control and states of other controls
 * @param {*} context 
 * @param {*} binding 
 * @param {*} formCellContainerProxy 
 * @param {*} personnelControl 
 */
async function finalizeConfirmationScenarioFields(context, binding) {
    let feature = binding.ConfirmationScenarioFeature;
    const screen = context.getControl('FormCellContainer');
    const captionDescriptor = context.getBindingObject().IsOnCreate ? 'create' : 'update';
    const coopScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/Cooperation.global').getValue();
    const doubleScenario = context.getGlobalDefinition('/SAPAssetManager/Globals/ConfirmationScenarios/DoubleCheck.global').getValue();

    if (binding.ConfirmationScenario === coopScenario) { //Handle editing an existing cooperation confirmation
        feature = 'Support';
    }
    if (binding.ConfirmationScenario === doubleScenario) { //Handle editing an existing double check confirmation
        feature = 'DoubleCheck';
    }
    if (feature) { //This is a cooperation confirmation, so set the segment control and states of other controls
        const stylizer = new Stylizer(['GrayText']);
        let scenario;

        if (feature === 'Support') scenario = coopScenario;
        if (feature === 'DoubleCheck') scenario = doubleScenario;

        screen.getControl('ScenarioSeg').setValue(feature, false);
        screen.getControl('ScenarioSeg').setEditable(false);
        screen.getControl('ResponsiblePersonnelNum').setEditable(false);
        stylizer.apply(screen.getControl('ResponsiblePersonnelNum'), 'Value');
        screen.getControl('WorkOrderLstPkr').setEditable(false);
        if (binding.DisableOrderFields) { //Started a scenario by clicking segment on confirmation page, so all order fields should not be editable
            screen.getControl('OperationPkr').setEditable(false);
            screen.getControl('SubOperationPkr').setEditable(false);
        }

        let woTemp = context.getBindingObject()?.OrderID; //Grab the work order either from binding or picker on screen
        if (!woTemp) {
            woTemp = screen.getControl('WorkOrderLstPkr').getValue()[0].ReturnValue;
        }
        let configResult = await libConfirm.readConfigByPlant(context, woTemp, scenario);
        let timeEntryNotAllowed = !(await libConfirm.getAllowTimeUpdate(context, configResult));

        if (timeEntryNotAllowed) { //Time entry is not allowed for a cooperation, so hide the fields and set to zero duration and current date/time
            let startDateTime = new ODataDate();

            screen.getControl('DurationPkr').setValue('0');
            screen.getControl('DurationPkr').setVisible(false);
            screen.getControl('StartDatePicker').setVisible(false);
            screen.getControl('StartTimePicker').setVisible(false);
            screen.getControl('StartDatePicker').setValue(startDateTime.date());
            screen.getControl('StartTimePicker').setValue(startDateTime.date());
        }
        
        //Other fields that are non-editable for cooperations
        screen.getControl('VarianceReasonPkr').setVisible(false);
        screen.getControl('VarianceReasonPkr').setEditable(false);
        screen.getControl('ActivityTypePkr').setVisible(false);
        screen.getControl('ActivityTypePkr').setEditable(false);
        screen.getControl('ActivityTypePkr').setValue('', false);
        screen.getControl('AcctIndicatorPkr').setVisible(false);
        screen.getControl('AcctIndicatorPkr').setEditable(false);
        screen.getControl('AcctIndicatorPkr').setValue('', false);
        screen.getControl('IsFinalConfirmation').setVisible(false);
        screen.getControl('IsFinalConfirmation').setEditable(false);
        screen.getControl('IsFinalConfirmation').setValue(false, false);
        screen.getControl('DescriptionNote').setEditable(false); //Note is not editable for cooperations
        if (feature === 'Support') {
            context.setCaption(context.localizeText(`cooperation_${captionDescriptor}_title`)); //Set screen caption for cooperation
        }
        if (feature === 'DoubleCheck') {
            context.setCaption(context.localizeText(`double_check_${captionDescriptor}_title`)); //Set screen caption for double check
        }
    } else {
        if (captionDescriptor === 'update') { //Edited confirmations cannot be changed to cooperations
            screen.getControl('ScenarioSeg').setEditable(false);
        }
    }
}
