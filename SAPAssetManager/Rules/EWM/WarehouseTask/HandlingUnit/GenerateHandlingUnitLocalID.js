import GenerateLocalID from '../../../Common/GenerateLocalID';

export default function GenerateHandlingUnitLocalID(context) {
    return GenerateLocalID(context, 'WarehousePickHUs', 'HandlingUnit', '00000', "$filter=startswith(HandlingUnit, 'LOCAL') eq true", 'LOCAL').then(LocalId => {
        const formCellSection = context.getPageProxy('WarehouseTaskHandlingUnitPage').getControls('FormCellSection0');
        formCellSection[0]?.getControl('WhPickHandlingUnitSimple')?.setValue(LocalId);
        return LocalId;
    });
}
