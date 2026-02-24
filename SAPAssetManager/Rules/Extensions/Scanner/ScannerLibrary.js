
import { SAPScannerRegistry, SAPScannerConfig, SAPScannerMode, MDKScanner, KnoxCaptureScanner, ZebraScanner } from 'extension-SAPScannerFramework';
import { GlobalVar as GlobalClass } from '../../Common/Library/GlobalCommon';
import * as application from '@nativescript/core/application';

/**
 * Scanner library for scanner initialization, cleanup, and simple scanning
 * For a more complex scanning scenario, use the SAPScannerRegistry directly
 */
export default class ScannerLibrary {
    /**
     * Initialize the default scanner
     * @param {IClientAPI} context
     * @param {CustomScannerParser} customScannerParser
     * @returns {Promise<boolean>} true if scanner is initialized successfully, false otherwise
     */
    static async init(context, customScannerParser = undefined) {
        const scannerType = GlobalClass.getAppParam().THIRD_PARTY_SCANNER.SCANNERTYPE;
        const scannerRegistry = SAPScannerRegistry.getInstance();
        let isScannerIdentified = false;

        if (context.nativescript?.platformModule?.isAndroid) {
            const manufacturer = context.nativescript?.platformModule?.device?.manufacturer;
            const appContext = application.android.foregroundActivity;

            if (manufacturer === 'samsung' && scannerType === 'KNOX_CAPTURE') {
                scannerRegistry.setDefaultScanner(scannerRegistry.registerScanner(new KnoxCaptureScanner(appContext, customScannerParser)));
                scannerRegistry.getDefaultScanner().setHardKeyPushedListener(context, new KnoxCaptureHardKeyPushedListener());
                isScannerIdentified = true;
            } else if (manufacturer === 'Zebra Technologies' && scannerType === 'ZEBRA') {
                scannerRegistry.setDefaultScanner(scannerRegistry.registerScanner(new ZebraScanner(appContext, customScannerParser)));
                scannerRegistry.getDefaultScanner().setUnsolResultListener(context, new ZebraUnsolResultListener(), new SAPScannerConfig());
                isScannerIdentified = true;
            }
        }

        // If specific scanner is not identified, use the default scanner
        if (!isScannerIdentified) {
            scannerRegistry.setDefaultScanner(scannerRegistry.registerScanner(new MDKScanner(customScannerParser)));
        }

        let result = await scannerRegistry.getDefaultScanner().initialize(context);
        // If specific scanner is identified but initialization failed, try to initialize the default scanner
        if (!result && isScannerIdentified) {
            scannerRegistry.setDefaultScanner(scannerRegistry.registerScanner(new MDKScanner(customScannerParser)));
            result = await scannerRegistry.getDefaultScanner().initialize(context);
        }
        // If default scanner is still not identified, reset the flag of scanner identification
        isScannerIdentified = result;

        return isScannerIdentified;
    }

    /**
     * Cleanup the default scanner
     * @param {IClientAPI} context
     */
    static cleanup(context) {
        SAPScannerRegistry.getInstance().getDefaultScanner().cleanup(context);
        SAPScannerRegistry.getInstance().unregisterScanner(SAPScannerRegistry.getInstance().getDefaultScannerId());
    }

    /**
     * Trigger a simple single scan
     * @returns {Promise<string>} the scan result
     */
    static async triggerSingleScan() {
        const result = await SAPScannerRegistry.getInstance().getDefaultScanner().triggerScan();
        return result.value;
    }

    /**
     * Trigger a simple multi scan
     * @returns {Promise<string[]>} the scan result
     */
    static async triggerMultiScan() {
        const result = await SAPScannerRegistry.getInstance().getDefaultScanner().triggerScan(new SAPScannerConfig(SAPScannerMode.MULTI_SCAN));
        return result.value;
    }

    /**
     * Dispatch the scan result to the appropriate action
     * @param {IClientAPI} context
     * @param {string} scanResult
     * @returns {Promise<boolean>} true if the action is executed successfully, false otherwise
     */
    static async dispatch(context, scanResult) {
        const scannerConfig = context.getGlobalDefinition('/SAPAssetManager/Globals/Scanner/ThirdPartyScannerConfig.global').getValue();
        const currentPage = context.evaluateTargetPathForAPI('#Page:-Current');
        try {
            currentPage.showActivityIndicator();
            const params = await context.read('/SAPAssetManager/Services/AssetManager.service',
                'AppParameters', [], `$filter=ParamGroup eq '${scannerConfig}'`);
            if (params?.length > 0) {
                const promises = [], configs = [];
                for (let i = 0; i < params.length; i++) {
                    configs.push(JSON.parse(params.getItem(i).ParamValue));
                    promises.push(context.read('/SAPAssetManager/Services/AssetManager.service', params.getItem(i).ParameterName, [],
                        `$filter=${configs[configs.length - 1].ScanId} eq '${scanResult}'`));
                }
                const results = await Promise.all(promises);
                for (let i = 0; i < results?.length; i++) {
                    if (results[i].length > 0) {
                        const binding = results[i].getItem(0);
                        currentPage.setActionBinding(binding);
                        currentPage.dismissActivityIndicator();
                        return currentPage.executeAction(configs[i].NavAction);
                    }
                }
            } 
            currentPage.dismissActivityIndicator();
            return context.executeAction('/SAPAssetManager/Actions/Extensions/ScannerBarcodeNoMatch.action');
        } catch (err) {
            currentPage.dismissActivityIndicator();
            return false;
        }
    }
}

/**
 * Custom unsolicited result listener for Zebra scanner
 */
class ZebraUnsolResultListener {
    onScannerUnsolResult(context, result) {
        ScannerLibrary.dispatch(context, result.value);
    } 
}

/**
 * Custom hard key pushed listener for KNOX Capture scanner
 */
class KnoxCaptureHardKeyPushedListener {
    onHardKeyPushed(context) {
        SAPScannerRegistry.getInstance().getDefaultScanner().triggerScan().then((result) => {
            return ScannerLibrary.dispatch(context, result.value);
        }).catch((error) => {
            console.error('Scan failed: ', error.message);
        });
    }
}
