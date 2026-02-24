import DeviceType from '../../Common/DeviceType';
import * as application from '@nativescript/core/application';
import { getCurrentFontScale } from '@nativescript/core/accessibility';
// font scale range: https://github.com/NativeScript/NativeScript/blob/main/packages/core/accessibility/font-scale-common.ts
// Following configurations have been tested in several simulators for iOS and Android of different screen sizes and resolutions.
export default function EDTColumnWidth(context) {
    let ItemEDTColWidth;
    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                sloc: 90,
                hdec: 230,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                sloc: 220,
                hdec: 320,
                btn: 10,
            };
        }

    } else {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                sloc: 90,
                hdec: 190,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                sloc: 220,
                hdec: 320,
                btn: 10,
            };
        }
    }
    return ItemEDTColWidth;
    
}
export  function FLEDTOrderColumnWidth(context) {
    let ItemEDTColWidth;
    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 55,
                sloc: 90,
                qty: 70,
                uom: 80,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 65,
                sloc: 280,
                qty: 140,
                uom: 180,
                btn: 10,
            };
        }

    } else {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 60,
                sloc: 75,
                qty: 75,
                uom: 100,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 100,
                sloc: 220,
                qty: 160,
                uom: 200,
                btn: 10,
            };
        }
    }
    return ItemEDTColWidth;
    
}
export  function EDTHeight(context) {
    let fontScale = getCurrentFontScale();
    let height;

    if (application.ios) {
        if (fontScale >= 2.0) height = 95;
        else if (fontScale >= 1.5) height = 75;
        else if (fontScale >= 1.3) height = 64;
        else if (fontScale >= 1.15) height = 60;
        else height = 54;
    } else {
        height = DeviceType(context) === 'Phone' ? 53 : 49;
    }
    return height;
}



export function FLEDTColumnWidth(context) {
    let ItemEDTColWidth;
    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 55,
                sloc: 70,
                qty: 90,
                uom: 90,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 65,
                sloc: 280,
                qty: 140,
                uom: 180,
                btn: 10,
            };
        }

    } else {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 60,
                sloc: 75,
                qty: 75,
                uom: 100,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
               switch: 100,
                sloc: 220,
                qty: 160,
                uom: 200,
                btn: 10,
            };
        }
    }
    return ItemEDTColWidth;
    
}
export function FLEDTPackedPackagesColumnWidth(context) {
    let ItemEDTColWidth;
    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 55,
                actWght: 70,
                weightUOM:90,
                recvPnt: 90,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 65,
                actWght: 280,
                weightUOM:140,
                recvPnt: 180,
                btn: 10,
            };
        }

    } else {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 60,
                actWght: 75,
                weightUOM:75,
                recvPnt: 100,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
               switch: 100,
                actWght: 220,
                weightUOM: 160,
                recvPnt: 200,
                btn: 10,
            };
        }
    }
    return ItemEDTColWidth;
    
}
export function EDTPackedContainersColumnWidth(context) {
    let ItemEDTColWidth;
    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 40,
                awght: 75,
                uom: 75,
                loc: 120,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 40,
                awght: 175,
                uom: 200,
                loc: 250,
                btn: 10,
            };
        }

    } else {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 60,
                awght: 75,
                uom: 75,
                loc: 100,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 120,
                awght: 180,
                uom: 180,
                loc: 235,
                btn: 10,
            };
        }
    }
    return ItemEDTColWidth;
    
}

export function EDTReadyToPackColumnWidth(context) {
    let ItemEDTColWidth;
    if (application.ios) {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 40,
                sloc: 140,
                hdec: 110,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 40,
                sloc: 270,
                hdec: 255,
                btn: 10,
            };
        }

    } else {
        if (DeviceType(context) === 'Phone') {
            ItemEDTColWidth = {
                switch: 60,
                sloc: 130,
                hdec: 110,
                btn: 10,
            };
        } else {
            ItemEDTColWidth = {
                switch: 120,
                sloc: 220,
                hdec: 220,
                btn: 10,
            };
        }
    }
    return ItemEDTColWidth;
    
}



