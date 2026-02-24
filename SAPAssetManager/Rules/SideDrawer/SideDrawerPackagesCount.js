import libCommon from '../Common/Library/CommonLibrary';

export default function SideDrawerPackagesCount(clientAPI) {
    return libCommon.getEntitySetCount(clientAPI, 'FldLogsPackages')
        .then(count => {
            return clientAPI.localizeText('fld_packages_x', [count]);
        });
}
