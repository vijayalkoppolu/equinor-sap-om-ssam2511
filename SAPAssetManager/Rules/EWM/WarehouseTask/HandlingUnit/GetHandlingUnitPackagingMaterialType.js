import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function GetHandlingUnitPackagingMaterialType(context) {
    return CommonLibrary.getStateVariable(context, 'PackagingMaterialTypeCreate');
}
