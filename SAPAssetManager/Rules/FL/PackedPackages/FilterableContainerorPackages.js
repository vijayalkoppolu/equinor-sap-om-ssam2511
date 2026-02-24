import libCom from '../../Common/Library/CommonLibrary';
export default function FilterableContainerorPackages(clientAPI) {
    if (libCom.getStateVariable(clientAPI, 'PackedPackages')) {
        return '#Page:AssignToContainerListViewPage/#Control:SectionedTable';
    }
    return '#Page:AssignToContPackageListViewPage/#Control:SectionedTable';
}
