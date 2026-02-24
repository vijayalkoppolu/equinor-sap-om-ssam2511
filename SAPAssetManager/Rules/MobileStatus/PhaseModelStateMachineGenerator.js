import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import libPersona from '../Persona/PersonaLibrary';
import StateMachineGenerator from './StateMachineGenerator';

export default class PhaseModelStateMachineGenerator extends StateMachineGenerator {

    /**
    *
    * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context
    * @param {PMMobileStatus} currentStatus
    * @param {string} objectType
    */
    constructor(context, currentStatus, objectType, binding) {
        super(context, currentStatus, objectType, binding);
        this._notificationObjectTypeConst = libCom.getGlobalDefinition(this._context, 'ObjectTypes/Notification.global');
        this._taskObjectTypeConst = libCom.getGlobalDefinition(this._context, 'ObjectTypes/Task.global');
    }

    async _addToEAMOverallStatusProfileFilter() {
        // skip this filter for tasks as it's not relevant
        if (this._objectType === this._taskObjectTypeConst) {
            return;
        }

        const orderTypeRecord = await this._getOrderTypeInfo();
        const { EAMOverallStatusProfile, PhaseModelActive } = orderTypeRecord;
        const phaseModelRelevant = PhaseModelActive === 'X' ? 'X' : '';

        const filter = EAMOverallStatusProfile
            ? `((ToEAMOverallStatusProfile eq '${EAMOverallStatusProfile}') or (PhaseModelRelevant eq '${phaseModelRelevant}' and ToEAMOverallStatusProfile eq ''))`
            : `PhaseModelRelevant eq '${phaseModelRelevant}' and ToEAMOverallStatusProfile eq ''`;

        this._filters.push(filter);
    }

    async _getOrderTypeInfo() {
        return this._context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['EAMOverallStatusProfile', 'PhaseModelActive'], `$filter=OrderType eq '${this._binding.WOHeader.OrderType}'`).then(orderTypeArray => {
            if (orderTypeArray.length > 0) {
                return orderTypeArray.getItem(0);
            }
            return '';
        });
    }

    async readStatusSequences() {
        /* for notifications there's a limitation that we can't identify correct status sequences by querying EAMOverallStatusSeqs directly,
        so we have to use nav links */
        if (this._objectType === this._notificationObjectTypeConst) {
            try {
                const queryOptions = await this._generateQueryOptions();
                return await this._executeRead(queryOptions, `${this._binding['@odata.readLink']}/NotifMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`);
            } catch (err) {
                Logger.error('readStatusSequences', err);
                return [];
            }
        }

        return super.readStatusSequences();
    }

    async _generateFilterOptions() {
        if (this._objectType === this._notificationObjectTypeConst) {
            if (libPersona.getActivePersona(this._context)) {
                this._filters.push(`UserPersona eq '${libPersona.getActivePersona(this._context)}'`);
            }
            return;
        }

        super._generateFilterOptions();
    }
}
