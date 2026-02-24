import ODataLibrary from '../OData/ODataLibrary';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';
import QABSettings from '../QAB/QABSettings';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import WorkOrderMobileStatusLibrary from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import ConfirmationScenariosFeatureIsEnabled from '../ConfirmationScenarios/ConfirmationScenariosFeatureIsEnabled';

export default function SubOperationUpdateNav(context) {
    const qabSettings = new SubperationQABSettings(context.getPageProxy());

    return qabSettings.generateChips();
}

class SubperationQABSettings extends QABSettings {

    async generateChips() {
        const isLocal = ODataLibrary.isLocal(this._context.getPageProxy().binding);
        const isOrderComplete = await WorkOrderMobileStatusLibrary.isOrderComplete(this._context);

        const chips = [
            this._createAddNoteChip({
                IsButtonEnabled: await EnableWorkOrderEdit(this._context) && (isLocal || !isOrderComplete),
                IsButtonVisibleBySettings: false,
            }),
            this._createAddNotificationChip({
                Label: this._context.localizeText('add_notification'),
                IsButtonEnabled: isLocal || !isOrderComplete,
            }),
            this._createAddServiceConfirmationChip({
                Label: this._context.localizeText('add_service_confirmation'),
                IsEnabled: ConfirmationsIsEnabled(this._context),
                IsButtonEnabled: IsAddConfirmationButtonVisible(this._context),
                Action: '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateFromSuboperation.js',
            }),
            await this._createTakeReadingsChip(),
            this._createSDFChip(),
        ];

        if (ConfirmationScenariosFeatureIsEnabled(this._context)) {
            chips.push(await this._createCooperationChip());
            chips.push(await this._createDoubleCheckChip());
        }

        return super.generateChips(chips);
    }
}
