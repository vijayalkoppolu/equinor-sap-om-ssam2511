import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import SetUpAttachmentTypes from '../../Documents/SetUpAttachmentTypes';
import GetNotificationItemStepData from './GetNotificationItemStepData';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default async function NotificationUpdateMalfunctionEndOnPageLoad(context) {
    SetUpAttachmentTypes(context);
    let binding = context.getBindingObject();
     //Malfunction date/time
    let formCellContainer = context.getControl('FormCellContainer');
    let startDate = formCellContainer.getControl('MalfunctionStartDatePicker');
    let startTime = formCellContainer.getControl('MalfunctionStartTimePicker');
    let endDate = formCellContainer.getControl('MalfunctionEndDatePicker');
    let endTime = formCellContainer.getControl('MalfunctionEndTimePicker');
    let startSwitch = formCellContainer.getControl('BreakdownStartSwitch');
    let endSwitch = formCellContainer.getControl('BreakdownEndSwitch');
    let effectControl = formCellContainer.getControl('EffectListPicker');

    if (IsCompleteAction(context)) {
        let breakdownIndicator = !!binding.BreakdownIndicator;

        if (breakdownIndicator) { //Breakdown has been set, so enable and populate related fields during consolidated complete
            startDate.setVisible(true);
            startTime.setVisible(true);
            endDate.setVisible(true);
            endTime.setVisible(true);
            startSwitch.setVisible(true);
            endSwitch.setVisible(true);
            effectControl.setVisible(true);

            if (binding.MalfunctionStartDate) {
                startDate.setEditable(true);
                startTime.setEditable(true);
                startSwitch.setValue(true);
                startDate.setValue(new OffsetODataDate(context, binding.MalfunctionStartDate, binding.MalfunctionStartTime).date());
                startTime.setValue(new OffsetODataDate(context, binding.MalfunctionStartDate, binding.MalfunctionStartTime).date());
            }

            if (binding.MalfunctionEndDate) {
                endDate.setEditable(true);
                endTime.setEditable(true);
                endSwitch.setValue(true);
                endDate.setValue(new OffsetODataDate(context, binding.MalfunctionEndDate, binding.MalfunctionEndTime).date());
                endTime.setValue(new OffsetODataDate(context, binding.MalfunctionEndDate, binding.MalfunctionEndTime).date());
            }
        }
        const itemStepData = await GetNotificationItemStepData(context);
        formCellContainer.getControl('ItemDescription').setValue(itemStepData.Item?.ItemText || '');
        formCellContainer.getControl('PartGroupLstPkr').setValue(itemStepData.Item?.ObjectPartCodeGroup || '');
        formCellContainer.getControl('PartDetailsLstPkr').setValue(itemStepData.Item?.ObjectPart || '');
        formCellContainer.getControl('DamageGroupLstPkr').setValue(itemStepData.Item?.CodeGroup || '');
        formCellContainer.getControl('DamageDetailsLstPkr').setValue(itemStepData.Item?.DamageCode || '');
        formCellContainer.getControl('CauseDescription').setValue(itemStepData.Cause?.CauseText || '');
        formCellContainer.getControl('CauseGroupLstPkr').setValue(itemStepData.Cause?.CauseCodeGroup || '');
        formCellContainer.getControl('CodeLstPkr').setValue(itemStepData.Cause?.CauseCode || '');
        formCellContainer.getControl('CauseNote').setValue(itemStepData.CauseLongText?.TextString || '');
        formCellContainer.getControl('ItemNote').setValue(itemStepData.ItemLongText?.TextString || '');

    } else {
        if (binding?.BreakdownIndicator) {
            startDate.setVisible(true);
            startTime.setVisible(true);
            endDate.setVisible(true);
            endTime.setVisible(true);
            startSwitch.setVisible(true);
            endSwitch.setVisible(true);
            effectControl.setVisible(true);
        }

        //Offset for local timezone
        if (binding.MalfunctionStartDate) {
            formCellContainer.getControl('BreakdownStartSwitch').setValue(true);
            startDate.setEditable(true);
            startTime.setEditable(true);
            startDate.setValue(new OffsetODataDate(context, binding.MalfunctionStartDate, binding.MalfunctionStartTime).date());
            startTime.setValue(new OffsetODataDate(context, binding.MalfunctionStartDate, binding.MalfunctionStartTime).date());
        }

        if (binding.MalfunctionEndDate) {
            formCellContainer.getControl('BreakdownEndSwitch').setValue(true);
            endDate.setEditable(true);
            endTime.setEditable(true);
            endDate.setValue(new OffsetODataDate(context, binding.MalfunctionEndDate, binding.MalfunctionEndTime).date());
            endTime.setValue(new OffsetODataDate(context, binding.MalfunctionEndDate, binding.MalfunctionEndTime).date());
        }
    }

}
