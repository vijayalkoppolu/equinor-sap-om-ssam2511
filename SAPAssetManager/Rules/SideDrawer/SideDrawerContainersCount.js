import libCommon from '../Common/Library/CommonLibrary';

export default function SideDrawerContainersCount(clientAPI) {
    return libCommon.getEntitySetCount(clientAPI, 'FldLogsContainers')
        .then(count => {
            return clientAPI.localizeText('fld_containers_x', [count]);
        });
}
