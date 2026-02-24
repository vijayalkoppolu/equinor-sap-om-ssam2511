import TimeSheetEntryCreateOperationEntitySet from '../../../TimeSheets/TimeSheetEntryCreateOperationEntitySet';

export async function getRelatedOperations(context) {
    let operations;
    try {
        operations = await TimeSheetEntryCreateOperationEntitySet(context);
    } catch (error) {
        console.error('Failed to fetch operations:', error);
        operations = undefined;
    }
    return operations;
}
export function getFirstOperationNoFromTitles(titles) {
    // Split the string into lines and trim whitespace
    const lines = titles.split('\n').map(line => line.trim()).filter(Boolean);
    if (!lines.length) return '';
    // The first line should be in the format "operationNo - description"
    const [operationNo] = lines[0].split(' - ');
    return operationNo?.trim() || '';
}

export async function getRelatedOperationsTitles(context) {
    let operationsList = await getRelatedOperations(context);
    let operationsTitles = operationsList.map(operation => {
        // Split the DisplayValue by ' - ' to separate the operation number and description
        let [operationNo, description] = operation.DisplayValue.split(' - ');

        // Take only the first line of the description
        let shortText = description?.split('\n')[0] || '';

        // Combine the operation number and the first line
        return `${operationNo} - ${shortText}`;
    });
    return operationsTitles.join('\n');

}


export async function getFirstRelatedOperationNo(context) {
    let operationsList = await getRelatedOperations(context);
    return operationsList?.length 
    ? operationsList[0].ReturnValue.match(/OperationNo='(\d+)'/)?.[1] || '' 
    : '';
}
export async function isOperationNumberRelated(context, targetOperationNo) {
    const operationsList = await getRelatedOperations(context);
    
    if (!operationsList) {
        return false; 
    }

    // Check if the target operation number is part of any related operation
    return operationsList.some(operation => {
        const match = operation.ReturnValue.match(/OperationNo='(\d+)'/);
        return match && match[1] === targetOperationNo; 
    });
}
