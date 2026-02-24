import Logger from '../../Log/Logger';

export default function UpdateMap(context, pageName) {
    try {
        let pageProxy = context.evaluateTargetPathForAPI('#Page:' + pageName);
        if (pageProxy) {
            let mapControl = pageProxy.getControl('MapExtensionControl');
            if (!mapControl) {
                mapControl = pageProxy.getControls()[0];
            }

            if (mapControl) {
                let extension = mapControl.getExtension();
                if (extension && typeof extension.update === 'function') {
                    extension.update();
                } else if (mapControl._control && typeof mapControl._control.update === 'function') {
                    mapControl._control.update();
                }
            }
        }
    } catch (err) {
        Logger.error('Sync', err.message);
    }
}
