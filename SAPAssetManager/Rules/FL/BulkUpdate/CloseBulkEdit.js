import checkForChangesBeforeClose from '../../Common/CheckForChangesBeforeClose';
export default function CloseBulkIEdit(context) {
    const result = checkForChangesBeforeClose(context);
    return result.then(({ data }) => {
        return !!data;
    });
}
