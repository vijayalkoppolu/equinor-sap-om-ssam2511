import libCommon from '../Common/Library/CommonLibrary';

export default function SideDrawerVoyagesCount(clientAPI) {
    return libCommon.getEntitySetCount(clientAPI, 'FldLogsVoyages')
        .then(count => {
            return clientAPI.localizeText('fld_voyages_x', [count]);
        });
}
