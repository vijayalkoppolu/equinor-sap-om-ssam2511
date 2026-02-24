import Logger from '../../../Log/Logger';

export default function GetHuNoInWho(context) {

    const warehouseOrder = context.binding.WarehouseOrder;
    const queryOptions = `$filter=WarehouseOrder eq '${warehouseOrder}'`;

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehousePickHUs', [], queryOptions)
        .then(result => {
            if (result && result.length > 0) {
                // Extract existing numbers and find the highest one
                const existingNumbers = result
                    .map(item => item.HuNoInWho)
                    .filter(number => number !== null && number !== undefined)
                    .map(number => parseInt(number, 10))
                    .sort((a, b) => a - b);

                    let nextNumber;
                    if (existingNumbers.length > 0) {
                        nextNumber = existingNumbers.length + 1;
                    } else {
                        nextNumber = 1;
                    }
                
                return nextNumber.toString().padStart(3, '0');
        } else {
            return '001';
        }
    }).catch(error => {
        Logger.error('Error reading WarehousePickHUs:', error);
        throw error;
    });
}
