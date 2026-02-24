import QABSettings from '../../QAB/QABSettings';
import EnableWorkOrderCreateFromWorkOrder from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreateFromWorkOrder';
import { showAssignDependingOnAssignmentType } from '../../OnlineSearch/WorkOrders/AccessoryButtonIcon';
import EnableNotificationCreateFromWorkOrder from '../../UserAuthorizations/Notifications/EnableNotificationCreateFromWorkOrder';
import libCom from '../../Common/Library/CommonLibrary';

export default class OnlineWorkOrderQABSettings extends QABSettings {
    async generateChips() {
        this._checkIfCanAddToWorkOrder();
        let chips = [
            await this._createAssignChip(),
        ];
        if (this._context?.binding['@odata.type'] === libCom.getGlobalDefinition(this._context, 'ODataTypes/OnlineWorkOrder.global')) {
            chips.unshift(
                await this._createAddWorkOrderChip(),
                await this._createAddNotificationChip(),
            );
        }
        return super.generateChips(chips);
    }


    async _createAddWorkOrderChip(props = {}) {
        const IsButtonEnabled = this._canAddToOrder && await EnableWorkOrderCreateFromWorkOrder(this._context);
        return super._createAddWorkOrderChip({
            ...{
                'Label': this._context.localizeText('add_order'),
                'Action': '/SAPAssetManager/Rules/WorkOrders/FollowUpWorkOrderCreateNav.js',
                IsButtonEnabled,
            },
            ...props,
        });
    }

    async _createAddNotificationChip() {
        const IsButtonEnabled = this._canAddToOrder && await EnableNotificationCreateFromWorkOrder(this._context);
        return super._createAddNotificationChip({
            'Label': this._context.localizeText('add_notification'),
            'Action': '/SAPAssetManager/Rules/WorkOrders/WorkOrderNotificationCreateNav.js',
            IsButtonEnabled,
        });
    }

    async _createAssignChip(props = {}) {
        const IsButtonEnabled = this._canAddToOrder && await showAssignDependingOnAssignmentType(this._context);
        return this._createChip({
            ...{
                'Label': this._context.localizeText('assign'),
                'Icon': '$(PLT,/SAPAssetManager/Images/QABAssign.png,/SAPAssetManager/Images/QABAssign.android.png)',
                'Action': '/SAPAssetManager/Rules/OnlineSearch/Download/DownloadToDevice.js',
                '_Name': 'ASSIGN_WO',
                IsButtonEnabled,
            }, ...props,
        });
    }

    _checkIfCanAddToWorkOrder() {
        const isCompleted = this._context?.binding?.SystemStatusCode?.includes(libCom.getGlobalDefinition(this._context, 'SystemStatuses/TechnicallyCompleted.global'));
        this._canAddToOrder = !isCompleted;
    }
}
