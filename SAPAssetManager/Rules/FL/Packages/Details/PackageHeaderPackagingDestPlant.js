import { getPlantNameFL } from '../../Common/FLLibrary';
 
export default function PackageHeaderPackagingDestPlant(context) {
    return getPlantNameFL(context, context.binding.PackagingDestPlant);
}
