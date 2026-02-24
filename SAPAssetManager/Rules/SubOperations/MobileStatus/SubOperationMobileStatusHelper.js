import libCom from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libSubOperationMobile from './SubOperationMobileStatusLibrary';
import { GetOrderTypes } from '../../Common/CacheMobileStatusSeqs'; 
import ODataLibrary from '../../OData/ODataLibrary';

export default class SubOperationMobileStatusHelper {

    /**
     * 
     * @param {IPageProxy} context 
     */
    constructor(context, binding, currentStatus, objectType) {
        this._context = context;
        this._binding = binding;
        this._objectType = objectType;
        this._currentStatus = currentStatus;

        const { STARTED } = libMobile.getMobileStatusValueConstants(context);
        this._STARTED = STARTED;
    }
    
    /**
     * Returns if Started status is visible for order
     * @returns {boolean}
     */
    async isAnythingStarted() {
        const isAnySubOperationStarted = await libSubOperationMobile.isAnySubOperationStarted(this._context);
        return isAnySubOperationStarted;
    }
    
    /**
     * Returns if Completed status is visible for order
     * @returns {boolean}
     */
    isCompletedStatusVisible() {
        return true;
    }

    /**
     * Returns if Work Completed status is visible for order
     * @returns {boolean}
     */
    isWorkCompletedStatusVisible() {
        return false;
    }

    /**
     * Returns if mobile status can be changed
     * @returns {boolean}
     */
    isStatusChangeable() {
        return libMobile.isSubOperationStatusChangeable(this._context);
    }

    /**
     * Returns if Confirm/Unconfirm status transitions are visible
     * @returns {boolean}
     */
    isConfirmUnconfirmVisible() {
        const operationMobileStatus = libMobile.getMobileStatus(this._binding.WorkOrderOperation, this._context);
        const WOMobileStatus = libMobile.getMobileStatus(this._binding.WorkOrderOperation?.WOHeader, this._context);
        
        return operationMobileStatus === this._STARTED || WOMobileStatus === this._STARTED;
    }

    async isConfirmStatusVisible() {
        const isConfirmed = await this.getIsSubOperationConfirmed();

        return !isConfirmed;
    }
    
    async isUnconfirmStatusVisible() {
        const isConfirmed = await this.getIsSubOperationConfirmed();

        return isConfirmed;
    }
    
    async getIsSubOperationConfirmed() {
        if (libCom.isDefined(this._isSubOperationConfirmed)) {
            return this._isSubOperationConfirmed;
        }

        const isConfirmed = await libMobile.isMobileStatusConfirmed(this._context, this._binding, this._binding.SubOperationNo);
        this._isSubOperationConfirmed = isConfirmed;

        return isConfirmed;
    }
    
    isTransferStatusVisible() {
        return !ODataLibrary.isLocal(this._binding);
    }

    isAssignStatusVisible() {
        return false;
    }
   
    isUnassignReassignStatusVisible() {
        return false;
    }

    getEAMOverallStatusProfile() {
        const orderType = this._binding?.WorkOrderOperation?.WOHeader?.OrderType;
        const planningPlant = this._binding?.WorkOrderOperation?.WOHeader?.PlanningPlant;
        if (orderType && planningPlant) {
            const orderTypeFound = GetOrderTypes(this._context).find(orderTypeRow => 
                (orderType === orderTypeRow.OrderType && planningPlant === orderTypeRow.PlanningPlant));
            if (orderTypeFound) {
                return orderTypeFound.EAMOverallStatusProfile;
            }
        }
        return 'NotFound'; 
    }
}
