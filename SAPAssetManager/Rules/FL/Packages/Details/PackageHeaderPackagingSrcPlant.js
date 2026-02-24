import { getPlantNameFL } from '../../Common/FLLibrary';
 
export default function PackageHeaderPackagingSrcPlant(context) {
    return getPlantNameFL(context, context.binding.PackagingSourcePlant);
}
