import CommonLibrary from '../Common/Library/CommonLibrary';
export default function SideDrawerFLReadyToPack(context) {
    const readyToPackPromise = CommonLibrary.getEntitySetCount(context, 'FldLogsPackCtnRdyPcks');
    const packedPackagesPromise = CommonLibrary.getEntitySetCount(context, 'FldLogsPackCtnPkdPkgs');
    const packedContainersPromise = CommonLibrary.getEntitySetCount(context, 'FldLogsPackCtnPkdCtns');

    return Promise.all([readyToPackPromise, packedPackagesPromise, packedContainersPromise])
        .then(([readyToPack, packedPackages, packedContainers]) => {
            const total = readyToPack + packedPackages + packedContainers;
            return context.localizeText('pack_containers_x', [total]);
        });
}
