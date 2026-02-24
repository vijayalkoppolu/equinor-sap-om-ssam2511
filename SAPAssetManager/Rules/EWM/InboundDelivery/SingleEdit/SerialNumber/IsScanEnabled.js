import { IBDGetSerialNumberScanEnabled } from './IBDSerialNumberLib';

export default function IsScanEnabled(context) {
    return IBDGetSerialNumberScanEnabled(context);
}
