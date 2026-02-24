/**
 * Returns properties for the seal update, only including non-empty seal numbers.
 * @param {IClientAPI} clientAPI
 */
export default function FLPackedContainersSealProperties(clientAPI) {
    const props = {
        ActionType: 'SEAL',
    };
    for (let i = 1; i <= 5; i++) {
        const value = clientAPI.evaluateTargetPath(`#Control:SealNumber${i}/#Value`);
        if (value !== null && value !== undefined && value !== '') {
            props[`FldLogsSealNumber${i}`] = value;
        }
    }
    props.ObjectId = clientAPI.evaluateTargetPath('#Property:ObjectId');
    return props;
}
