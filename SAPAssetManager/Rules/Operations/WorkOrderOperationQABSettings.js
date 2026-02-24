import QABSettings from '../QAB/QABSettings';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';
import EnableNotificationCreateFromWorkOrderOperation from '../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrderOperation';
import IsAddConfirmationButtonVisible from '../QAB/IsAddConfirmationButtonVisible';
import libPersona from '../Persona/PersonaLibrary';
import IsMeterComponentEnabled from '../ComponentsEnablement/IsMeterComponentEnabled';
import MeterSectionLibrary from '../Meter/Common/MeterSectionLibrary';
import EnableSubOperation from '../UserAuthorizations/WorkOrders/EnableSubOperation';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import DocumentAddFromOperationDetails from '../Documents/DocumentAddFromOperationDetails';
import IsAddConfirmationButtonVisibleOnOperationDetails from '../QAB/IsAddConfirmationButtonVisibleOnOperationDetails';
import TechniciansExist from '../WorkOrders/Operations/TechniciansExist';
import ConfirmationScenariosFeatureIsEnabled from '../ConfirmationScenarios/ConfirmationScenariosFeatureIsEnabled';
export default class WorkOrderOperationQABSettings extends QABSettings {
    async generateChips() {
        const isEnabledWorkorderEdit = await EnableWorkOrderEdit(this._context);

        const chips = [
            await this._addSubOperationChip(),
            this._createAddNotificationChip({
                'Label': this._context.localizeText('add_notification'),
                'IsEnabled': EnableNotificationCreate(this._context) && !IsPhaseModelEnabled(this._context),
                'IsButtonEnabled': await EnableNotificationCreateFromWorkOrderOperation(this._context),
                'IsButtonVisible': EnableNotificationCreate(this._context) && !IsPhaseModelEnabled(this._context),
                'Action': '/SAPAssetManager/Rules/Operations/WorkOrderOperationNotificationCreateNav.js',
            }),
            await this._addMeterChip(),
            this._createAddPartChip({ IsButtonEnabled: isEnabledWorkorderEdit, IsButtonVisibleBySettings: false }),
            this._createAddNoteChip({ IsButtonEnabled: isEnabledWorkorderEdit, IsButtonVisibleBySettings: false }),
            await this._createAddSmartFormChip(),
            this._createAddServiceConfirmationChip({
                'Label': this._context.localizeText('add_service_confirmation'),
                'IsEnabled': ConfirmationsIsEnabled(this._context),
                'IsButtonEnabled': (await IsAddConfirmationButtonVisibleOnOperationDetails(this._context)) && libPersona.isMaintenanceTechnician(this._context) && IsAddConfirmationButtonVisible(this._context),
                'Action': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationCreateFromOperation.js',
            }),
            await this._createTakeReadingsChip(),
            this._createAddAttachmentChip({
                'IsButtonEnabled': await DocumentAddFromOperationDetails(this._context),
                '_Name': 'ADD_ATTACHMENT_QAB',
            }),
            await this._createAddMileageChip({ IsButtonVisibleBySettings: true }),
            await this._createAddExpenseChip({ IsButtonVisibleBySettings: true }),
            await this._createDownloadDocumentsChip(),
            this._createSDFChip(),
            await this._viewTechnicians(),
        ];

        if (ConfirmationScenariosFeatureIsEnabled(this._context)) {
            chips.push(await this._createCooperationChip());
            chips.push(await this._createDoubleCheckChip());
        }

        return super.generateChips(chips);
    }

    async _addSubOperationChip() {
        return this._createChip({
            'Label': this._context.localizeText('add_suboperation'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABAddSubOperation.ios.png,/SAPAssetManager/Images/QABAddSubOperation.android.png)',
            'IsButtonEnabled': await EnableSubOperation(this._context),
            'IsButtonVisibleBySettings': false,
            'Action': '/SAPAssetManager/Rules/SubOperations/CreateUpdate/SubOperationCreateNav.js',
            '_Name': 'ADD_SUBOPERATION_QAB',
        });
    }

    async _addMeterChip() {
        const meterEnabled = IsMeterComponentEnabled(this._context);
        return this._createChip({
            'Label': meterEnabled ? await MeterSectionLibrary.quickActionTargetValues(this._context, 'Label') : '',
            'Icon': meterEnabled ? await MeterSectionLibrary.quickActionTargetValues(this._context, 'Icon') : '',
            'IsEnabled': meterEnabled && await MeterSectionLibrary.newObjectCellSectionVisible(this._context, 'QAB'),
            'IsButtonVisibleBySettings': false,
            'Action': meterEnabled ? await MeterSectionLibrary.quickActionTargetValues(this._context, 'Action') : '',
            '_Name': 'METER_QAB_ACTION',
        });
    }

    async _viewTechnicians() {
        const binding = this._context.getPageProxy().binding;
        const splitsExist = await TechniciansExist(this._context, binding);
        return this._createChip({
            'Label': this._context.localizeText('technicians'),
            'Icon': '$(PLT,/SAPAssetManager/Images/QABTechnicians.ios.png,/SAPAssetManager/Images/QABTechnicians.android.png)',
            'IsEnabled': splitsExist,
            'IsButtonEnabled': splitsExist,
            'IsButtonVisible': splitsExist,
            'IsButtonVisibleBySettings': true,
            'Action': '/SAPAssetManager/Actions/WorkOrders/Operations/TechniciansListViewNav.action',
            '_Name': 'VIEW_TECHNICIANS_QAB',
        });
    }
}
