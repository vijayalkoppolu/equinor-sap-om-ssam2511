import ODataLibrary from '../../OData/ODataLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { WorkOrderLibrary as libWO } from '../WorkOrderLibrary';
import IsAssignEnableWorkOrder from './IsAssignEnableWorkOrder';
import IsUnAssignOrReAssignEnableWorkOrder from './IsUnAssignOrReAssignEnableWorkOrder';
import libWOMobile from './WorkOrderMobileStatusLibrary';
import { GetOrderTypes } from '../../Common/CacheMobileStatusSeqs'; 

export default class WorkOrderMobileStatusHelper {

    /**
     * 
     * @param {IPageProxy} context 
     */
    constructor(context, binding, currentStatus, objectType) {
        this._context = context;
        this._binding = binding;
        this._objectType = objectType;
        this._currentStatus = currentStatus;

        const { WORKCOMPL } = libMobile.getMobileStatusValueConstants(context);
        this._WORKCOMPL = WORKCOMPL;
    }
    
    /**
     * Returns if Started status is visible for order
     * @returns {boolean}
     */
    async isAnythingStarted() {
        const isAnyWorkOrderStarted = await libWOMobile.isAnyWorkOrderStarted(this._context);
        return isAnyWorkOrderStarted;
    }
    
    /**
     * Returns if Completed status is visible for order
     * @returns {boolean}
     */
    isCompletedStatusVisible() {
        if (libWO.isWCMWorkOrder(this._context, this._binding)) {
            return this._currentStatus?.MobileStatus === this._WORKCOMPL;
        }

        return true;
    }

    /**
     * Returns if Work Completed status is visible for order
     * @returns {boolean}
     */
    isWorkCompletedStatusVisible() {
        return libWO.isWCMWorkOrder(this._context, this._binding);
    }

    /**
     * Returns if mobile status can be changed
     * @returns {boolean}
     */
    isStatusChangeable() {
        return libMobile.isHeaderStatusChangeable(this._context);
    }

    /**
     * Returns if Confirm/Unconfirm status transitions are visible
     * @returns {boolean}
     */
    isConfirmUnconfirmVisible() {
        return false;
    }

    isTransferStatusVisible() {
        return !ODataLibrary.isLocal(this._binding);
    }

    isAssignStatusVisible() {
        return IsAssignEnableWorkOrder(this._context, this._binding);
    }
   
    isUnassignReassignStatusVisible() {
        return IsUnAssignOrReAssignEnableWorkOrder(this._context, this._binding);
    }

    getEAMOverallStatusProfile() {
        const orderType = this._binding?.OrderType;
        const planningPlant = this._binding?.PlanningPlant;
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
