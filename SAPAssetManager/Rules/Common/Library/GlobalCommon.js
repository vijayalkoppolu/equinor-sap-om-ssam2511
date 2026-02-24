/**
 * Static class that has all of the getter and setter of the global variable
 */
export class GlobalVar {

    static setAppParam(value) {
        this._globalAppParam = value;
    }

    static getAppParam() {
        return this._globalAppParam;
    }

    static setUserSystemInfo(value) {
        this._globalUserSystemInfo = value;
    }

    static getUserSystemInfo() {
        return this._globalUserSystemInfo;
    }

    static setUserGeneralInfo(value) {
        this._globalUserGeneralInfo = value;
    }

    static getUserGeneralInfo() {
        return this._globalUserGeneralInfo;
    }

    static setDeltaSyncUserPreferenceInfo(value) {
        this._globalDeltaSyncUserPreferenceInfo = value;
    }

    static getDeltaSyncUserPreferenceInfo() {
        return this._globalDeltaSyncUserPreferenceInfo;
    }

    static setNotificationProcessingContexts(value) {
        this._globalNotificationProcessingContexts = value;
    }

    static getNotificationProcessingContexts() {
        return this._globalNotificationProcessingContexts;
    }
}
