import libCom from '../../Common/Library/CommonLibrary';
import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import Logger from '../../Log/Logger';
import DownloadFailed from './DownloadFailed';

export default function AssignToUser(context) {
    const pageProxy = context.getPageProxy();
    const binding = pageProxy.getActionBinding();
    const personnelNumber = libCom.getPersonnelNumber();
    context.setActionBinding({ ...binding, EmployeeTo: personnelNumber, EmployeeFrom: binding.AssignedTo, OperationNo: binding.OperationNo || '', SubOperationNo: binding.SubOperationNo || '' });

    return libTelemetry.executeActionWithLogUserEvent(context,
        '/SAPAssetManager/Actions/Supervisor/Assign/WorkOrderAssignOnline.action',
        context.getGlobalDefinition('/SAPAssetManager/Globals/Features/OnlineSearch.global').getValue(),
        libTelemetry.EVENT_TYPE_ASSIGN).catch((error) => {
            Logger.error('AssignToUser', error);
            const sectionedTable = pageProxy.getControl('SectionedTable');
            if (sectionedTable) {
                sectionedTable.redraw();
            }
            return DownloadFailed(context);
        });
}
